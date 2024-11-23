from app.config.database import db
offers_collection=db["Location"]
def insert_loc(insert_data):
    return offers_collection.insert_one(insert_data)