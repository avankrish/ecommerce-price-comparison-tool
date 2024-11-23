import json
from app.models.product_category import insert_productcategory

def scraper_category():
    try:
        with open ("app/scraper/category.json","r") as file:
            data=json.load(file)
        print("category.json loaded sucessfully")
        
        category_inserted=insert_productcategory(data)
        category_ids = {cat["name"]: str(inserted_id) for cat, inserted_id in zip(data, category_inserted.inserted_ids)}
        print("data inserted into category collection")

        with open('app/data/category_ids.json',"w") as file1:
                json.dump(category_ids,file1)
        print("category_ids.json created sucessfully")

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
        