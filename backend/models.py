from sqlalchemy import Column, String, Integer, DateTime,ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Shipment_details(Base):
    __tablename__ = "search"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, index=True, nullable=False)
    destination = Column(String, index=True, nullable=False)
    search_type = Column(String)

    containers = relationship("Container", back_populates="search")
    packages = relationship("Package", back_populates="search")


class Container_details(Base):
    __tablename__="container"
    container_id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('search.id'))
    size = Column(String, nullable=True)
    type = Column(String, nullable=True)
    commodity = Column(String, nullable=True)
    count = Column(Integer, nullable=True)
    weight = Column(String, nullable=True)  # Ensure this column is defined
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    Shipment_details=relationship("Shipment_details",back_populates="container")

class Package_details(Base):
    __tablename__="Package"
    Package_id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('search.id'))
    cargo_readiness_date= Column(DateTime, nullable=True)
    commodity = Column(String, nullable=True)
    subcommodity=Column(String,nullable=True)
    type=Column(String,nullable=True)
    package_type=Column(String,nullable=True)
    No_of_units=Column(int,nullable=True)
    total_Volume=Column(String,nullable=True)
    total_weight=Column(String, nullable=True)
    handling=Column(String,nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    Shipment_details=relationship("Shipment_details",back_populates="Package")

class load_details(Base):
    __tablename__="Load"
    Load_id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('search.id'))
    cargo_readiness_date= Column(DateTime, nullable=True)
    commodity = Column(String, nullable=True)
    load_as=Column(String,nullable=True)
    type=Column(String,nullable=True)
    package_type=Column(String,nullable=True)
    No_of_units=Column(int,nullable=True)
    total_Volume=Column(String,nullable=True)
    total_weight=Column(String, nullable=True)
    handling=Column(String,nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class LoadDetail(Base):
    __tablename__ = 'load_details'
    
    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('search.id'))
    cargo_readiness_date = Column(DateTime)
    commodity = Column(String)
    load_as = Column(String)
    
    search = relationship("Search", back_populates="load_details")
    trucks = relationship("TruckDetail", back_populates="load_detail")

class TruckDetail(Base):
    __tablename__ = 'truck_details'
    
    id = Column(Integer, primary_key=True, index=True)
    load_detail_id = Column(Integer, ForeignKey('load_details.id'))
    truck_type = Column(String)
    select_truck = Column(String)
    truck_count = Column(Integer)
    
    load_detail = relationship("LoadDetail", back_populates="trucks")

