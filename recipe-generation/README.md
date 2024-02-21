# recipe-generation

The python code in this folder resolves recipes and stores them in a database.

## Setup

1. Install dependencies with `poetry install`
2. Create `.env` with `cp .env.example .env` and add your MongoDB url.
3. Initiate the database with `reset.py`

## Run

- Run the resolver `main.py`
- Check the status of your database with `db_checker.py`
