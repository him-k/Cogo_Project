from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException , Query
from pydantic.types import Json

from sqlalchemy import desc , asc

def create_search_base(db: Session, search: schemas.SearchSystemBase):
    db_search = models.SearchSystemBase(**search.dict())
    db.add(db_search)
    db.commit()
    db.refresh(db_search)
    return db_search

def create_fcl(db: Session, fcl: schemas.FCLCreate):
    db_fcl = models.FCL(**fcl.dict())
    db.add(db_fcl)
    db.commit()
    db.refresh(db_fcl)
    return db_fcl

def create_air(db: Session, air: schemas.AIRCreate):
    db_air = models.AIR(**air.dict())
    db.add(db_air)
    db.commit()
    db.refresh(db_air)
    return db_air

def get_search(db: Session, id: int):
    return db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == id).first()

def get_container_info(db: Session , id : int):
    search= db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == id).first()
    
    details = {
        'id': search.id,
        'origin': search.origin,
        'destination': search.destination,
        'service_type': search.service_type,
        'fcl': [],
        'air': []
    }
    
    if search.service_type == models.ServiceTypeEnum.FCL:
        fcl_entries = db.query(models.FCL).filter(models.FCL.search_id == search.id).all()
        for fcl in fcl_entries:
            details['fcl'].append({
                'id': fcl.id,
                'search_id': fcl.search_id,
                'size': fcl.size or '0',
                'type': fcl.type or 'NA',
                'commodity': fcl.commodity or 'NA',
                'count': fcl.count or 0
            })
    elif search.service_type == models.ServiceTypeEnum.AIR:
        air_entries = db.query(models.AIR).filter(models.AIR.search_id == search.id).all()
        for air in air_entries:
            details['air'].append({
                'id': air.id,
                'search_id': air.search_id,
                'cargo_date': air.cargo_date or 'NA',
                'commodity': air.commodity or 'NA',
                'sub_commodity': air.sub_commodity or 'NA' ,
                'type': air.type or 'NA',
                'package_type': air.package_type or 'NA',
                'no_of_units' : air.no_of_units or 0,
                'tot_vol' : air.tot_vol or 0,
                'tot_weight' : air.tot_weight or 0,
                'handling' : air.handling or 'NA'

            })
    

    return details

def get_all_searches(
    db: Session, 
    filters: Json = Query({})
):
    page = filters.get('page', 1)
    page_size = filters.get('page_size', 5)
    origin = filters.get('origin', None)
    destination = filters.get('destination', None)
    service_type = filters.get('service_type', None)
    start_date = filters.get('start_date', None)
    end_date = filters.get('end_date', None)
    sort_by = filters.get('sort_by', 'updated_at')
    sort_type = filters.get('sort_type', 'desc')

    offset = (page - 1) * page_size
    query = db.query(models.SearchSystemBase)

    if origin:
        query = query.filter(models.SearchSystemBase.origin == origin)
    if destination:
        query = query.filter(models.SearchSystemBase.destination == destination)
    if service_type:
        query = query.filter(models.SearchSystemBase.service_type == service_type)
    if start_date:
        query = query.filter(models.SearchSystemBase.updated_at >= start_date)
    if end_date:
        query = query.filter(models.SearchSystemBase.updated_at <= end_date)

    if sort_by and sort_type:
        sort_attr = getattr(models.SearchSystemBase, sort_by)
        if sort_type == "desc":
            query = query.order_by(desc(sort_attr))
        else:
            query = query.order_by(asc(sort_attr))

    total_count = query.count()
    search_list = query.offset(offset).limit(page_size).all()

    search_details = []
    for search in search_list:
        details = {
            'id': search.id,
            'origin': search.origin,
            'destination': search.destination,
            'service_type': search.service_type,
            'fcl': [],
            'air': []
        }
        
        if search.service_type == models.ServiceTypeEnum.FCL:
            fcl_entries = db.query(models.FCL).filter(models.FCL.search_id == search.id).all()
            for fcl in fcl_entries:
                details['fcl'].append({
                    'id': fcl.id,
                    'search_id': fcl.search_id,
                    'size': fcl.size or '0',
                    'type': fcl.type or 'NA',
                    'commodity': fcl.commodity or 'NA',
                    'count': fcl.count or 0
                })
        elif search.service_type == models.ServiceTypeEnum.AIR:
           air_entries = db.query(models.AIR).filter(models.AIR.search_id == search.id).all()
           for air in air_entries:
                details['air'].append({
                    'id': air.id,
                    'search_id': air.search_id,
                    'cargo_date': air.cargo_date or 'NA',
                    'commodity': air.commodity or 'NA',
                    'sub_commodity': air.sub_commodity or 'NA' ,
                    'type': air.type or 'NA',
                    'package_type': air.package_type or 'NA',
                    'no_of_units' : air.no_of_units or 0,
                    'tot_vol' : air.tot_vol or 0,
                    'tot_weight' : air.tot_weight or 0,
                    'handling' : air.handling or 'NA'

                })
        
        search_details.append(details)

    total_pages = (total_count + page_size - 1) // page_size

    return search_details, total_count



def get_all_fcls(db: Session):
    fcls = db.query(models.FCL).filter(models.FCL.size != None).all()
    
    fcl_list = []
    for fcl in fcls:
        search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == fcl.search_id).first()
        fcl_list.append({
            "id": fcl.id,
            "search_id" : fcl.search_id , 
            "origin": search.origin,
            "destination": search.destination,
            "size": fcl.size,
            "type": fcl.type,
            "commodity": fcl.commodity,
            "count": fcl.count
        })
    return fcl_list

def get_all_airs(db: Session):
    airs = db.query(models.AIR).filter(models.AIR.cargo_date != None).all()
    air_list = []
    for air in airs:
        search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == air.search_id).first()
        air_list.append({
            "id": air.id,
            "search_id" : air.search_id,
            "origin": search.origin,
            "destination": search.destination,
            "cargo_date": air.cargo_date,
            "commodity": air.commodity,
            "sub_commodity": air.sub_commodity,
            "type": air.type,
            "package_type": air.package_type,
            "no_of_units": air.no_of_units,
            "tot_vol": air.tot_vol,
            "tot_weight": air.tot_weight,
            "handling": air.handling
        })
    return air_list


def get_fcl(db: Session, id: int):
    fcl = db.query(models.FCL).filter(models.FCL.id == id).first()
    if fcl:
        search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == fcl.search_id).first()
        return {
            "id": fcl.id,
            "search_id" : fcl.search_id,
            "origin": search.origin,
            "destination": search.destination,
            "size": fcl.size,
            "type": fcl.type,
            "commodity": fcl.commodity,
            "count": fcl.count
        }
    return None

def get_air(db: Session, id: int):
    air = db.query(models.AIR).filter(models.AIR.id == id).first()
    if air:
        search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == air.search_id).first()
        return {
            "id": air.id,
            "search_id" : air.search_id,
            "origin": search.origin,
            "destination": search.destination,
            "cargo_date": air.cargo_date,
            "commodity": air.commodity,
            "sub_commodity": air.sub_commodity,
            "type": air.type,
            "package_type": air.package_type,
            "no_of_units": air.no_of_units,
            "tot_vol": air.tot_vol,
            "tot_weight": air.tot_weight,
            "handling": air.handling
        }
    return None


def update_container(db : Session , id : int , request: schemas.ContainerUpdateRequest):
     # Check if the search entry exists
    db_search = get_search(db, id)
    if not db_search:
        raise HTTPException(status_code=404, detail="Search not found")

    # Ensure the search ID in the request matches the path parameter
    if request.id != id:
        raise HTTPException(status_code=400, detail="Search ID mismatch")

    # Lists to hold updated FCL and AIR entries
    updated_fcl_entries = []
    updated_air_entries = []

    # Handle FCL updates
    if request.service_type == schemas.ServiceTypeEnum.FCL:
        for fcl in request.fcl:
            if fcl.id:
                # Update existing FCL entry
                db_fcl = db.query(models.FCL).filter(models.FCL.id == fcl.id, models.FCL.search_id == id).first()
                if db_fcl:
                    db_fcl.size = fcl.size
                    db_fcl.type = fcl.type
                    db_fcl.commodity = fcl.commodity
                    db_fcl.count = fcl.count
                    db.commit()
                    db.refresh(db_fcl)
                    updated_fcl_entries.append(db_fcl)
                else:
                    raise HTTPException(status_code=404, detail=f"FCL entry with id {fcl.id} not found")
            else:
                # Add new FCL entry
                new_fcl = models.FCL(
                    search_id=id,
                    size=fcl.size,
                    type=fcl.type,
                    commodity=fcl.commodity,
                    count=fcl.count
                )
                db.add(new_fcl)
                db.commit()
                db.refresh(new_fcl)
                updated_fcl_entries.append(new_fcl)

    # Handle AIR updates
    elif request.service_type == schemas.ServiceTypeEnum.AIR:
        for air in request.air:
            if air.id:
                # Update existing AIR entry
                db_air = db.query(models.AIR).filter(models.AIR.id == air.id, models.AIR.search_id == id).first()
                if db_air:
                    db_air.cargo_date = air.cargo_date
                    db_air.commodity = air.commodity
                    db_air.sub_commodity = air.sub_commodity
                    db_air.type = air.type
                    db_air.package_type = air.package_type
                    db_air.no_of_units = air.no_of_units
                    db_air.tot_vol = air.tot_vol
                    db_air.tot_weight = air.tot_weight
                    db_air.handling = air.handling
                    db.commit()
                    db.refresh(db_air)
                    updated_air_entries.append(db_air)
                else:
                    raise HTTPException(status_code=404, detail=f"AIR entry with id {air.id} not found")
            else:
                # Add new AIR entry
                new_air = models.AIR(
                    search_id=id,
                    cargo_date=air.cargo_date,
                    commodity=air.commodity,
                    sub_commodity=air.sub_commodity,
                    type=air.type,
                    package_type=air.package_type,
                    no_of_units=air.no_of_units,
                    tot_vol=air.tot_vol,
                    tot_weight=air.tot_weight,
                    handling=air.handling
                )
                db.add(new_air)
                db.commit()
                db.refresh(new_air)
                updated_air_entries.append(new_air)

    # Update the request model with the updated entries
    request.fcl = [schemas.FCLUpdate.from_orm(fcl) for fcl in updated_fcl_entries]
    request.air = [schemas.AIRUpdate.from_orm(air) for air in updated_air_entries]

    return request    


def update_search(db: Session, id: int, search: schemas.SearchSystemBase):
    db_search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == id).first()
    if not db_search:
        raise HTTPException(status_code=404, detail="Search not found")

    for key, value in search.dict().items():
        setattr(db_search, key, value)
    
    db.commit()
    db.refresh(db_search)
    return db_search

def delete_search(db: Session, id: int):
    db_search = db.query(models.SearchSystemBase).filter(models.SearchSystemBase.id == id).first()
    if db_search:
        db.delete(db_search)
        db.commit()
    return db_search
