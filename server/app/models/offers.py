from app.config.database import db
offers_collection=db["Offers"]
def insert_offers(insert_data):
    return offers_collection.insert_one(insert_data)