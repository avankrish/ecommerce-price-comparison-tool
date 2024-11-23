from app.config.database import db
productcategory_collection=db["Product_categories"]
def insert_productcategory(insert_data):
    return productcategory_collection.insert_many(insert_data)