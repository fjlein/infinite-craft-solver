from time import sleep
import sys
from app.db import db

sys.stdout.write("\n" * 3)
while True:
    recipe_count = db.recipes.count_documents({"result": {"$ne": None}})
    queue_count = db.recipes.count_documents({"result": None})
    element_count = len(db.recipes.distinct("result.name"))
    sys.stdout.write("\u001b[1000D")
    sys.stdout.write("\u001b[3A")
    print(f"Recipes  = {recipe_count}  ")
    print(f"Queued   = {queue_count}   ")
    print(f"Elements = {element_count} ")
    sleep(1)
