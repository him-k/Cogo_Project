from pydantic import BaseModel
from typing import Optional

class Shipment_detailsBase(BaseModel):
    origin: str
    destination: str
    size: Optional[str] = None
    type: Optional[str] = None
    commodity: Optional[str] = None
    count: Optional[int] = 0
    weight: Optional[str] = None

    class Config:
        orm_mode = True

class Shipment_detailsCreate(Shipment_detailsBase):
    pass

class Shipment(Shipment_detailsBase):
    id: int

    class Config:
        orm_mode = True

class Shipment_detailsUpdate(Shipment_detailsBase):
    origin: str
    destination: str
    size: str
    type: str
    commodity: str
    count: int
    weight: str

class Shipment_detailsUpdateOptional(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    commodity: Optional[str] = None
    count: Optional[int] = None
    weight: Optional[str] = None

    class Config:
        orm_mode = True
