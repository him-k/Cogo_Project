#Connecting FastAPI to postgresql database
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import psycopg2

database_url =  "postgresql://postgres:Dheeraj@localhost/shipping"

#creating SQLAlchemy engine
engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#creating a base class for models
Base = declarative_base()