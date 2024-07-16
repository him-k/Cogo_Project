#Connecting FastAPI to postgresql database
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import psycopg2
import os

from dotenv import load_dotenv

load_dotenv()

#SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

database_url =  "postgresql://postgres:Priyanshi@localhost:5432/COGO"

#creating SQLAlchemy engine
engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#creating a base class for models
Base = declarative_base()