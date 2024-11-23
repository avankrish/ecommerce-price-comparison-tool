from app.config.database import db
faq_collection=db["FAQ"]
def insert_faq(insert_data):
    return faq_collection.insert_one(insert_data)