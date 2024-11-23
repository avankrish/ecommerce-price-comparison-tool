from app.config.database import db
product_collection=db["Products"]
def insert_product(insert_data):
    return product_collection.insert_one(insert_data)