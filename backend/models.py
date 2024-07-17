# from sqlalchemy import Column, Integer, String, DateTime
# from sqlalchemy.sql import func
# from .database import Base

# class SearchSystem(Base):
#     __tablename__ = 'searchv2'

#     id = Column(Integer, primary_key=True, index=True)
#     origin = Column(String, index=True, nullable=False)
#     destination = Column(String, nullable=False)
#     size = Column(String, nullable=False)
#     type = Column(String, nullable=False)
#     commodity = Column(String, nullable=False)
#     count = Column(Integer, nullable=True)
#     created_at = Column(DateTime, default=func.now(), nullable=False)
#     updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


from sqlalchemy import Column, Integer, String, DateTime, ForeignKey , Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum


class ServiceTypeEnum(enum.Enum):
    FCL = "FCL"
    AIR = "AIR"

class SearchSystemBase(Base):
    __tablename__ = 'searchv22'

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, index=True, nullable=False)
    destination = Column(String, nullable=False)
    service_type = Column(Enum(ServiceTypeEnum), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    fcl = relationship("FCL", back_populates="search")
    air = relationship("AIR", back_populates="search")

   


class FCL(Base):
    __tablename__ = 'fclll'

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('searchv22.id'))
    size = Column(String, nullable=True)
    type = Column(String, nullable=True)
    commodity = Column(String, nullable=True)
    count = Column(Integer, nullable=True)

    search = relationship("SearchSystemBase", back_populates="fcl")


class AIR(Base):
    __tablename__ = 'airrr'

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey('searchv22.id'))
    cargo_date = Column(DateTime, nullable=True)
    commodity = Column(String, nullable=True)
    sub_commodity = Column(String, nullable=True)
    type = Column(String, nullable=True)
    package_type = Column(String, nullable=True)
    no_of_units = Column(Integer, nullable=True)
    tot_vol = Column(Integer, nullable=True)
    tot_weight = Column(Integer, nullable=True)
    handling = Column(String, nullable=True)

    search = relationship("SearchSystemBase", back_populates="air")
