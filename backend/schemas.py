from pydantic import BaseModel
from typing import Optional
from datetime import date
from typing import List

class Shipment_detailsBase(BaseModel):
    origin: str
    destination: str
    size: Optional[str]=None
    type: Optional[str]=None
    commodity:Optional[str]=None
    count : Optional[int]=0
    weight : Optional[str]=None

class Shipment_detailsCreate(Shipment_detailsBase):
    pass
    class Config:
        orm_mode = True

# class ShipmentQuery(BaseModel):
#     pageno: int=1
#     page_size: int=5
#     origin: Optional[str] = None
#     destination: Optional[str] = None
#     #size: Optional[str] = None
#     #type: Optional[str] = None
#     #commodity: Optional[str] = None
#     sort_by: Optional[str] = "updated_at"
#     start_date:Optional[date]=None
#     end_date:Optional[date]=None
#     sort_type: Optional[str] = "desc"

  

class Shipment(Shipment_detailsBase):
    id: int
    class Config:
        orm_mode = True

class Shipment_detailsUpdate(Shipment_detailsBase):
    origin: str
    destination: str
    size: str
    type: str
    commodity:str
    count : int 
    weight : str
    pass
    class Config:
        orm_mode = True

class Shipment_detailsUpdateOptional(Shipment_detailsBase):
    origin: Optional[str] = None
    destination: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    commodity: Optional[str] = None
    count: Optional[int] = 0
    weight: Optional[str] = None

    class Config:
        orm_mode = True


class PaginatedSearchResponse(BaseModel):
    list: List[Shipment_detailsBase]
    page: int
    total_count: int
    page_size: int
    total_pages: int
        