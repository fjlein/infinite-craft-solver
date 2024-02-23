from itertools import combinations_with_replacement
from app.db import db

db.recipes.delete_many({})


starting_elements = [
    {"name": "Water", "emoji": "💧"},
    {"name": "Fire", "emoji": "🔥"},
    {"name": "Wind", "emoji": "💨"},
    {"name": "Earth", "emoji": "🌍"},
]


combinations = list(combinations_with_replacement(starting_elements, 2))

for c in combinations:
    f, s = sorted(c, key=lambda x: x["name"])
    print(f, s)
    db.recipes.insert_one(
        {
            "first": f,
            "second": s,
        }
    )
