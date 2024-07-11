from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func
from database import Base

class Shipment_details(Base):
    __tablename__ = "Shipment_details"  # Fixed the typo in the table name
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True, nullable=False)
    destination = Column(UUID(as_uuid=True), default=uuid.uuid4, index=True, nullable=False)
    size = Column(String, nullable=True)
    type = Column(String, nullable=True)
    commodity = Column(String, nullable=True)
    count = Column(Integer, nullable=True)
    weight = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
