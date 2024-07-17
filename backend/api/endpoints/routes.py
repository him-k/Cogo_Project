from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List
from pydantic.types import Json
from ... import schemas, crud , models
from ...database import get_db
import requests
import httpx
from typing import Dict, Any


router = APIRouter()

@router.post("/create_search", response_model=schemas.SearchSystemWithDetails)
def create_search(search: schemas.SearchSystemBase, db: Session = Depends(get_db)):
    created_search = crud.create_search_base(db, search)
    
    details = schemas.SearchSystemWithDetails(**search.dict(), id=created_search.id)
    if search.service_type == schemas.ServiceTypeEnum.FCL:
           
            fcl_entries = []
            details.fcl = fcl_entries
    elif search.service_type == schemas.ServiceTypeEnum.AIR:
          
            air_entries = []
            details.air = air_entries
    
    return details




@router.post("/create_fcl", response_model=schemas.FCL)
def create_fcl(fcl: schemas.FCLCreate, db: Session = Depends(get_db)):
    return crud.create_fcl(db, fcl)

@router.post("/create_air", response_model=schemas.AIR)
def create_air(air: schemas.AIRCreate, db: Session = Depends(get_db)):
    return crud.create_air(db, air)


@router.get("/get_containers/{id}")
def get_container_details(id: int, db: Session = Depends(get_db)):
    db_search = crud.get_container_info(db , id)
    if not db_search:
        raise HTTPException(status_code=404, detail="No searches found")
    return db_search

@router.get("/get_search/{id}", response_model=schemas.responseBase)
def get_search(id: int, db: Session = Depends(get_db)):
    db_search = crud.get_search(db, id)
    if not db_search:
        raise HTTPException(status_code=404, detail="Search not found")
    return db_search

@router.get("/get_searches", response_model=schemas.PaginatedSearchResponse)
def get_searches(filters: Json = Query({}), db: Session = Depends(get_db)):
    db_searches, total_count = crud.get_all_searches(db, filters)
    if not db_searches:
        raise HTTPException(status_code=404, detail="No searches found")

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


@router.get("/get_fcl/{id}", response_model=schemas.FCLResponse)
def get_fcl(id: int, db: Session = Depends(get_db)):
    fcl = crud.get_fcl(db, id)
    if not fcl:
        raise HTTPException(status_code=404, detail="FCL not found")
    return fcl

@router.get("/get_air/{id}", response_model=schemas.AIRResponse)
def get_air(id: int, db: Session = Depends(get_db)):
    air = crud.get_air(db, id)
    if not air:
        raise HTTPException(status_code=404, detail="AIR not found")
    return air

@router.get("/get_all_fcl", response_model=List[schemas.FCLResponse])
def get_all_fcl(db: Session = Depends(get_db)):
    fcl_list = crud.get_all_fcls(db)
    if not fcl_list:
        raise HTTPException(status_code=404, detail="No FCL entries found")
    return fcl_list

@router.get("/get_all_air", response_model=List[schemas.AIRResponse])
def get_all_air(db: Session = Depends(get_db)):
    air_list = crud.get_all_airs(db)
    if not air_list:
        raise HTTPException(status_code=404, detail="No AIR entries found")
    return air_list

@router.put("/update_search/{id}", response_model=schemas.SearchSystemBase)
def update_search(id: int, search: schemas.SearchSystemBase, db: Session = Depends(get_db)):
    return crud.update_search(db, id, search)

@router.put("/update_containers/{id}", response_model=schemas.ContainerUpdateRequest)
def update_containers(id: int, request: schemas.ContainerUpdateRequest, db: Session = Depends(get_db)):
    return crud.update_container(db , id , request)    

@router.delete("/delete_search/{id}", response_model=schemas.SearchSystemBase)
def delete_search(id: int, db: Session = Depends(get_db)):
    deleted_search = crud.delete_search(db, id)
    if not deleted_search:
        raise HTTPException(status_code=404, detail="Search not found")
    return deleted_search


