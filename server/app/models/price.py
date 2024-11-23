from app.config.database import db
price_collection=db["Price"]
def insert_price(insert_data):
    return price_collection.insert_one(insert_data)