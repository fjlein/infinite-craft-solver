from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

CONNECTION_STRING = os.getenv("MONGODB_URI")

client = MongoClient(CONNECTION_STRING)

db = client["infinite-craft"]
