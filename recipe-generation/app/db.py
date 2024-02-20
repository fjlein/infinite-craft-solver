from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

CONNECTION_STRING = os.getenv("APP_MONGO_URL")

client = MongoClient(CONNECTION_STRING)

db = client["infinite-craft"]
