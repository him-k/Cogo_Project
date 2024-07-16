import logging
from fastapi import FastAPI,Depends,HTTPException , Query
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models,schemas
from sqlalchemy import desc,asc
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
from datetime import date
from pydantic.types import Json
from fastapi import Query
from models import Shipment_details
app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
       db = SessionLocal()
       try:
           yield db
       finally:
           db.close()



@app.post("/shipments/", response_model=schemas.Shipment)
def create_shipment(shipment: schemas.Shipment_detailsCreate, db: Session = Depends(get_db)):
    # add a check for start and end to not be same 
    print(f"Received shipment data: {shipment.dict()}")
    if(shipment.origin==shipment.destination):
        return "INVALID REQUEST ORIGIN AND DESTINATION CAN NOT BE SAME"
    try:
        db_shipment = models.Shipment_details(**shipment.dict())
        db.add(db_shipment)
        db.commit()
        db.refresh(db_shipment)
        print("Shipment saved to database.")
        return db_shipment
    except Exception as e:
        print(f"Error saving shipment: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/shipments/{shipment_id}", response_model=schemas.Shipment)
def read_shipment(shipment_id: int, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return db_shipment


@app.get("/shipments/", response_model=schemas.PaginatedSearchResponse)
def get_searches(           
    filters: Json = Query({}),
    db: Session = Depends(get_db),
):
    print("inside get_searches")
    print("Received filters:", filters)
    db_searches, total_count = get_all_searches(db=db, filters=filters)
    print(db_searches)
    if not db_searches:
        raise HTTPException(status_code=404, detail="No configurations found")

    page = filters.get('page', 1)
    page_size = filters.get('page_size', 5)
    total_pages = (total_count + page_size - 1) // page_size

    return {
        "list": db_searches,
        "page": page,
        "total_count": total_count,
        "page_size": page_size,
        "total_pages": total_pages,
    }

def get_all_searches(
    db: Session, 
    filters: dict = Query({})
):
    page = filters.get('page', 1)
    page_size = filters.get('page_size', 5)
    origin = filters.get('origin', None)
    destination = filters.get('destination', None)
    size = filters.get('size', None)
    type = filters.get('type', None)
    #commodity = filters.get('commodity', None)
    start_date = filters.get('start_date', None)
    end_date = filters.get('end_date', None)
    sort_by = filters.get('sort_by', 'updated_at')
    orderBy = filters.get('orderBy', 'desc')


    offset = (page - 1) * page_size
    
    db_shipments = db.query(models.Shipment_details)

    if origin:
        db_shipments = db_shipments.filter(models.Shipment_details.origin == origin)
    if destination:
        db_shipments = db_shipments.filter(models.Shipment_details.destination == destination)
    if size:
        db_shipments = db_shipments.filter(models.Shipment_details.size == size)
    if type:
        db_shipments = db_shipments.filter(models.Shipment_details.type == type)
    #if commodity:
    #    db_shipments = db_shipments.filter(models.Shipment_details.commodity == commodity)
    if start_date:
        db_shipments = db_shipments.filter(models.Shipment_details.updated_at >= start_date)
    if end_date:
        db_shipments = db_shipments.filter(models.Shipment_details.updated_at <= end_date)

    # Apply sorting
    if sort_by and orderBy:
        sort_attr = getattr(models.Shipment_details, sort_by)
        if orderBy == "desc":
            db_shipments = db_shipments.order_by(desc(sort_attr))
        else:
            db_shipments = db_shipments.order_by(sort_attr)

    

    total_count = db_shipments.count()
    db_shipmentss = db_shipments.offset(offset).limit(page_size).all()

    if not db_shipmentss:
        raise HTTPException(status_code=404, detail="No Shipments found")

    return db_shipmentss , total_count

@app.put("/shipments/{shipment_id}", response_model=schemas.Shipment)
def update_shipment(shipment_id: int, shipment: schemas.Shipment_detailsUpdate, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    

    # Check if both origin and destination are present in the update request
    
    if shipment.origin == shipment.destination:
        raise HTTPException(status_code=400, detail="INVALID REQUEST ORIGIN AND DESTINATION CANNOT BE THE SAME")

    if shipment.count <= 0:
        raise HTTPException(status_code=400, detail="INVALID REQUEST COUNT CANNOT BE NEGATIVE")
    

    for field, value in shipment.dict(exclude_unset=True).items():
        setattr(db_shipment, field, value)

    if shipment.origin == shipment.destination:
        raise HTTPException(status_code=400, detail="INVALID REQUEST ORIGIN AND DESTINATION CANNOT BE THE SAME")

    if shipment.count <= 0:
        raise HTTPException(status_code=400, detail="INVALID REQUEST COUNT CANNOT BE NEGATIVE")
    db.commit()
    db.refresh(db_shipment)
    return db_shipment


@app.delete("/delete_shipment/{shipment_id}", response_model=schemas.Shipment)
def delete_configuration(shipment_id: int, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment:
        db.delete(db_shipment)
        db.commit()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return db_shipment

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
