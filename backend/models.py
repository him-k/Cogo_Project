from sqlalchemy import Column, String, Integer, JSON , DateTime
from sqlalchemy.sql import func
from database import Base

class Shipment_details(Base):
    __tablename__ = "search"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, index=True , nullable=False)
    destination = Column(String, index=True , nullable=False)
    size = Column(String ,  nullable=True)
    type = Column(String , nullable=True)
    commodity = Column(String , nullable=True)
    count = Column(Integer, nullable=True)
    weight = Column(String , nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False) 
    