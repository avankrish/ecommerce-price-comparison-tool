import json
from app.models.seller import insert_seller
loc_dict=[{"city":"chennai","state":"tn","country":"India"},{"city":"Bangalore","state":"Ka","country":"India"},{"city":"Mumbai","state":"Mh","country":"India"}]

def scraper_seller():
    try:
        loc_inserted=insert_seller(loc_dict)
        loc_ids = {seller["name"]: str(inserted_id) for seller, inserted_id in zip(seller_dict, seller_inserted.inserted_ids)}
        print("inserted data into seller collection")
        with open("app/data/seller_ids.json","w") as file:
            json.dump(seller_ids,file)
        print("seller_ids created successfully")
    except FileNotFoundError as e:
         print(e)
    except IOError as e:
         print(e)
    except json.JSONDecodeError as e:
         print(e)
    except TypeError as e:
         print("data format error\n",e)
    except OSError as e:
         print(e)
    except Exception as e:
         print("unexpected error",e)
        
