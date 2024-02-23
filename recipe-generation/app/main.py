import requests
import json
import random
from time import sleep
import logging
from fake_useragent import UserAgent
import datetime
import pymongo
from app.db import db

ua = UserAgent()

logging.basicConfig(filename="logging.log", filemode="w", level=logging.DEBUG)


def create_new_recipes():
    logging.info("Starting recipe creation")
    known_elements = db.recipes.distinct("first")
    
    new_element = db.recipes.find_one(
        filter={
            "result.name": {"$nin": [e["name"] for e in known_elements]},
        },
        sort=[("result.explored", pymongo.ASCENDING)],
        projection={"result.name": True, "result.emoji": True, "_id": False}
    )["result"]

    new_recipes = [{"first": new_element, "second": new_element}]

    for element in known_elements:
        first, second = sorted([element, new_element], key=lambda x: x["name"])
        new_recipes.append({"first": first, "second": second})

    db.recipes.insert_many(new_recipes)

    logging.info("Created %s new recipes with %s", len(new_recipes), new_element)


while True:

    recipe = db.recipes.find_one(
        filter={
            "result": None,
        },
        sort=[("first", pymongo.ASCENDING), ("second", pymongo.ASCENDING)],
    )

    # print(recipe)
    # print(recipe["first"])
    # print(recipe["first"]["name"])

    if recipe == None:
        logging.info("0 unresolved recipes found")
        create_new_recipes()
        continue

    logging.info("Crafting %s + %s", recipe["first"]["name"], recipe["second"]["name"])

    url = f"https://neal.fun/api/infinite-craft/pair?first={recipe['first']['name']}&second={recipe['second']['name']}"
    headers = {"referer": "https://neal.fun/infinite-craft/", "User-Agent": ua.random}

    try:
        response = requests.get(url=url, headers=headers, timeout=10)
        content = json.loads(response.content)
    except requests.exceptions.ConnectionError as e:
        logging.warning(repr(e))
        logging.info("Trying again in 10 seconds")
        sleep(10)
        continue
    except Exception as e:
        logging.warning(repr(e))
        logging.info("Trying again in 5 minutes")
        sleep(5 * 60)
        continue

    logging.info("Result = %s", content["result"])

    logging.info("Updating Recipe in database...")

    db.recipes.update_one(
        filter={"_id": recipe["_id"]},
        update={
            "$set": {
                "result": {
                    "name": content["result"],
                    "emoji": content["emoji"],
                    "explored": datetime.datetime.now(datetime.UTC),
                }
            }
        },
    )

    logging.info("...Updated Recipe in database")

    sleep(random.uniform(0.05, 0.1))
