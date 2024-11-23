from app.config.database import db
seller_collection=db["Seller"]
def insert_seller(insert_data):
    return seller_collection.insert_many(insert_data)