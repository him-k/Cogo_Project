from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models,schemas
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
app = FastAPI()

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

@app.get("/shipments/", response_model=List[schemas.Shipment])
def get_all_shipments(db: Session = Depends(get_db)):
    db_shipments = db.query(models.Shipment_details).all()
    if not db_shipments:
        raise HTTPException(status_code=404, detail="No Shipments found")
    return db_shipments

@app.put("/shipmentsOptionalUpdate/{shipment_id}",response_model=schemas.Shipment)
def optinal_update(shipment_id:int,shipment:schemas.Shipment_detailsUpdateOptional,db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    # Check if both origin and destination are present in the update request
    if 'origin' in shipment.dict(exclude_unset=True) and 'destination' in shipment.dict(exclude_unset=True):
        if shipment.origin == shipment.destination:
            raise HTTPException(status_code=400, detail="INVALID REQUEST ORIGIN AND DESTINATION CANNOT BE THE SAME")
    
    # Check if count is present and valid
    if 'count' in shipment.dict(exclude_unset=True) and shipment.count <= 0:
        raise HTTPException(status_code=400, detail="INVALID REQUEST COUNT CANNOT BE NEGATIVE")
    
    for field, value in shipment.dict(exclude_unset=True).items():
        setattr(db_shipment, field, value)
    
    db.commit()
    db.refresh(db_shipment)
    return db_shipment





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
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
