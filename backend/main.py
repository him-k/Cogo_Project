from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from sqlalchemy import desc
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import requests

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

def get_locations(url):
    response = requests.get(url)
    if response.status_code == 200:
        try:
            data = response.json()
            locations = data.get("list", [])
            if locations:
                return locations
            else:
                return "The list of locations is empty."
        except ValueError:
            return "Failed to parse JSON response."
    else:
        return f"Failed to fetch data, status code: {response.status_code}"
def search_display_name(location_id,url):
    location_list = get_locations(url)
    if isinstance(location_list, list):
        for location in location_list:
            if location.get("id") == location_id:
                return location.get("display_name")
        return f"No location found with the id {location_id}."
    else:
        return location_list


def search_id(location_name, url):
    location_list = get_locations(url)
    if isinstance(location_list, list):
        for location in location_list:
            if location.get("display_name") == location_name:
                return location.get("id")
        return f"No location found with the name {location_name}."
    else:
        return location_list

url = "https://api.stage.cogoport.io/list_locations"

@app.post("/shipments", response_model=schemas.Shipment)
def create_shipment(shipment: schemas.Shipment_detailsCreate, db: Session = Depends(get_db)):
    if shipment.origin == shipment.destination:
        raise HTTPException(status_code=400, detail="INVALID REQUEST: ORIGIN AND DESTINATION CANNOT BE THE SAME")
    
    origin_id = search_id(shipment.origin, url)
    destination_id = search_id(shipment.destination, url)
    
    if origin_id.startswith("No location found") or destination_id.startswith("No location found"):
        raise HTTPException(status_code=400, detail=f"Invalid locations: {origin_id}, {destination_id}")
    
    shipment_data = shipment.dict()
    shipment_data['origin'] = origin_id
    shipment_data['destination'] = destination_id

    try:
        db_shipment = models.Shipment_details(**shipment_data)
        db.add(db_shipment)
        db.commit()
        db.refresh(db_shipment)
        
        response_data = db_shipment.__dict__.copy()
        response_data['origin'] = str(response_data['origin'])
        response_data['destination'] = str(response_data['destination'])
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/shipments/{shipment_id}", response_model=schemas.Shipment)
def read_shipment(shipment_id: int, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    response_data = db_shipment.__dict__.copy()
    response_data['origin'] = str(response_data['origin'])
    response_data['destination'] = str(response_data['destination'])
    response_data['origin']=str(search_display_name(response_data['origin'],url))
    response_data['destination']=str(search_display_name(response_data['destination'],url))
    
    
    return response_data

@app.get("/shipments", response_model=List[schemas.Shipment])
def get_all_shipments(
    page: int = Query(1, ge=1), 
    page_size: int = Query(5, ge=1), 
    db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size
    db_shipments = (
        db.query(models.Shipment_details)
        .order_by(desc(models.Shipment_details.updated_at))
        .offset(offset)
        .limit(page_size)
        .all()
    )
    
    if not db_shipments:
        raise HTTPException(status_code=404, detail="No Shipments found")
    
    response_data = []
    for shipment in db_shipments:
        shipment_data = shipment.__dict__.copy()
        shipment_data['origin'] = str(shipment_data['origin'])
        shipment_data['destination'] = str(shipment_data['destination'])
        response_data.append(shipment_data)
    
    return response_data

@app.put("/shipmentsOptionalUpdate/{shipment_id}", response_model=schemas.Shipment)
def optional_update(shipment_id: int, shipment: schemas.Shipment_detailsUpdateOptional, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    if 'origin' in shipment.dict(exclude_unset=True) and 'destination' in shipment.dict(exclude_unset=True):
        if shipment.origin == shipment.destination:
            raise HTTPException(status_code=400, detail="INVALID REQUEST: ORIGIN AND DESTINATION CANNOT BE THE SAME")
    
    if 'count' in shipment.dict(exclude_unset=True) and shipment.count <= 0:
        raise HTTPException(status_code=400, detail="INVALID REQUEST: COUNT CANNOT BE NEGATIVE")
    
    if 'origin' in shipment.dict(exclude_unset=True):
        origin_id = search_id(shipment.origin, url)
        if origin_id.startswith("No location found"):
            raise HTTPException(status_code=400, detail=origin_id)
        shipment.origin = origin_id
    
    if 'destination' in shipment.dict(exclude_unset=True):
        destination_id = search_id(shipment.destination, url)
        if destination_id.startswith("No location found"):
            raise HTTPException(status_code=400, detail=destination_id)
        shipment.destination = destination_id

    for field, value in shipment.dict(exclude_unset=True).items():
        setattr(db_shipment, field, value)
    
    db.commit()
    db.refresh(db_shipment)
    
    response_data = db_shipment.__dict__.copy()
    response_data['origin'] = str(response_data['origin'])
    response_data['destination'] = str(response_data['destination'])
    
    return response_data

@app.put("/shipments/{shipment_id}", response_model=schemas.Shipment)
@app.put("/shipments/{shipment_id}", response_model=schemas.Shipment)
def update_shipment(shipment_id: int, shipment: schemas.Shipment_detailsUpdate, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    if shipment.origin == shipment.destination:
        raise HTTPException(status_code=400, detail="INVALID REQUEST: ORIGIN AND DESTINATION CANNOT BE THE SAME")

    if shipment.count <= 0:
        raise HTTPException(status_code=400, detail="INVALID REQUEST: COUNT CANNOT BE NEGATIVE")

    origin_id = search_id(shipment.origin, url)
    destination_id = search_id(shipment.destination, url)
    
    if origin_id.startswith("No location found") or destination_id.startswith("No location found"):
        raise HTTPException(status_code=400, detail=f"Invalid locations: {origin_id}, {destination_id}")

    # Convert the update dictionary excluding unset fields
    update_data = shipment.dict(exclude_unset=True)
    update_data['origin'] = origin_id
    update_data['destination'] = destination_id

    for field, value in update_data.items():
        setattr(db_shipment, field, value)
    
    db.commit()
    db.refresh(db_shipment)
    
    response_data = db_shipment.__dict__.copy()
    response_data['origin'] = str(response_data['origin'])
    response_data['destination'] = str(response_data['destination'])
    
    return response_data

@app.delete("/delete_shipment/{shipment_id}", response_model=schemas.Shipment)
def delete_configuration(shipment_id: int, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment_details).filter(models.Shipment_details.id == shipment_id).first()
    if db_shipment:
        db.delete(db_shipment)
        db.commit()
    if db_shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    response_data = db_shipment.__dict__.copy()
    response_data['origin'] = str(response_data['origin'])
    response_data['destination'] = str(response_data['destination'])
    
    return response_data

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
