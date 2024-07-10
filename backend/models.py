from sqlalchemy import Column, String, Integer, JSON
from database import Base

class Shipment_details(Base):
    __tablename__ = "search"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, index=True)
    destination = Column(String, index=True)
    size = Column(String)
    type = Column(String)
    commodity = Column(String)
     
    