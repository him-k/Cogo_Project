from pydantic import BaseModel

class Shipment_detailsBase(BaseModel):
    origin: str
    destination: str
    size: str
    type: str
    commodity: str
    count : int
    weight : str

class Shipment_detailsCreate(Shipment_detailsBase):
    pass

class Shipment(Shipment_detailsBase):
    id: int

    class Config:
        orm_mode = True
class Shipment_detailsUpdate(Shipment_detailsBase):
    pass


    class Config:
        orm_mode = True

