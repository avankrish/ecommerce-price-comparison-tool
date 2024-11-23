import requests
from bs4 import BeautifulSoup
from app.models.product import insert_product
from app.models.price import insert_price
from app.models.offers import insert_offers
import json
import time

with open("app\scraper\product_mapping.json","r") as file:
        mappings_data=json.load(file)
selectors={
        "IKIRU":{
              "product":".productitem",
              "product_url":".productitem--title a",
            "name":".productitem--title",           
            "image_url":".productitem--image-primary",            
            "brandname":".brand_name",
            "description":".description",
            "color":".color",
            "length":".length",
            "width":".width",
            "breadth":".breadth",
            "current_price":".money",
            "MRP":".money.price__compare-at--single",
            "rating":".rating",
            "discount_percentage":".discount"
        },
        "LivingShapes":{
              "product":".search__item__generic.globo-swatch-product-item",
              "product_url":".product__inline__title a",
            "name":".product__inline__title",
            "image_url":".tw-block.tw-overflow-hidden.tw-object-cover.tw-w-full.tw-h-full"   ,
            "brandname":".brand_name",
            "description":".description",
            "color":".color",
            "length":".length",
            "width":".width",
            "breadth":".breadth"   ,
            "current_price":".price.on-sale",
            "MRP":".compare-at",
            "rating":".product__rating__value",
            "discount_percentage":".compare-at_discount"
        },
        "RoyalOak":{
              "product":".item-box",
              "product_url":".product-item-link",
            "name":".product-item-link",           
            "image_url":".product-image-photo",
            "brandname":".brand_name",
            "description":".description",
            "color":".color",
            "length":".length",
            "width":".width",
            "breadth":".breadth"  ,
            "current_price":"span.special-price span.price-wrapper span.price",
            "MRP":"span.old-price span.price-wrapper span.price",
            "rating":".rating", 
            "discount_percentage":".offer"        
        }
    }

PRODUCT_LIMIT = 10
product_ids = {}


def fetch_with_retries(url, retries=3, delay=2):
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return response
        except requests.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(delay)
    return None

def scraper_product():
    with open("app/data/category_ids.json","r") as file1:
      category_id_data=json.load(file1)
    with open("app/data/seller_ids.json","r") as file3:
         seller_id_data=json.load(file3)
    for category,sites in mappings_data.items():
          
          for site,url in sites.items():
                product_count=0
                print(site)
                response=fetch_with_retries(url)
                if response and response.status_code==200:
                     print("200")
                else:
                     print("failed fetch data")
                     continue
                soup=BeautifulSoup(response.text,"html.parser")
                
                #if site=='Amazon':
                     
                
                for product in soup.select(selectors[site]["product"]):
                      if product_count>=PRODUCT_LIMIT:
                            break
                      cat_id=category_id_data.get(category)
                      sell_id=seller_id_data.get(site)
                            
                      product_data={
                        "product_name":product.select_one(selectors[site]["name"]).get_text(strip=True) if product.select_one(selectors[site]["name"]) else "N\A",
                        "category_id":cat_id if cat_id else "general category",
                        "seller_id":sell_id if sell_id else "Seller Unknown",
                        "product_url":product.select_one(selectors[site]["product_url"])["href"] if product.select_one(selectors[site]["product_url"]) else "N\A",
                        "image_url":product.select_one(selectors[site]["image_url"])["src"] if product.select_one(selectors[site]["image_url"]) else "N\A",
                        "brand_name":product.select_one(selectors[site]["brandname"]).get_text(strip=True) if product.select_one(selectors[site]["brandname"]) else "Universal Brand",
                        "description_":product.select_one(selectors[site]["description"]).get_text(strip=True) if product.select_one(selectors[site]["description"]) else "for all age groups",
                        "product_color":product.select_one(selectors[site]["color"]).get_text(strip=True) if product.select_one(selectors[site]["color"]) else "Black",
                        "product_length":product.select_one(selectors[site]["length"]).get_text(strip=True) if product.select_one(selectors[site]["length"]) else "200 cm",
                        "product_width":product.select_one(selectors[site]["width"]).get_text(strip=True) if product.select_one(selectors[site]["width"]) else "200 cm",
                        "product_breadth":product.select_one(selectors[site]["breadth"]).get_text(strip=True) if product.select_one(selectors[site]["breadth"]) else "200 cm",
                        "product_rating":product.select_one(selectors[site]["rating"]).get_text(strip=True) if product.select_one(selectors[site]["rating"]) else "4.5",
                         "price":product.select_one(selectors[site]["current_price"]).get_text(strip=True) if product.select_one(selectors[site]["current_price"]) else "N\A",
                         "Mrp":product.select_one(selectors[site]["MRP"]).get_text(strip=True) if product.select_one(selectors[site]["MRP"]) else "Same as price",
                         "discount_percent":product.select_one(selectors[site]["discount_percentage"]).get_text(strip=True) if product.select_one(selectors[site]["discount_percentage"]) else "N\A",
                         "valid_for":"30 days" 
                      }
                      if product_data["product_name"] !="N\A":
                             product_inserted=insert_product(product_data)
                             print("product inserted")
                             product_ids[product_data["product_name"]]=str(product_inserted.inserted_id)
                             with open("app\data\product_id.json","w") as file2:
                                  json.dump(product_ids,file2,indent=4)
                             print("product id updated")
                             price_data={
                                "price":product.select_one(selectors[site]["current_price"]).get_text(strip=True) if product.select_one(selectors[site]["current_price"]) else "N\A",
                                "Mrp":product.select_one(selectors[site]["MRP"]).get_text(strip=True) if product.select_one(selectors[site]["MRP"]) else "Same as price",
                                  "product_id":product_inserted.inserted_id 
                            }    
                             price_inserted=insert_price(price_data)
                             if price_inserted:
                                  print("price data inserted")
                             else:
                                  print("price not inserted")
                             offers_data={
                            "price":product.select_one(selectors[site]["current_price"]).get_text(strip=True) if product.select_one(selectors[site]["current_price"]) else "N\A",
                           "discount_percent":product.select_one(selectors[site]["discount_percentage"]).get_text(strip=True) if product.select_one(selectors[site]["discount_percentage"]) else "N\A",
                           "price":product.select_one(selectors[site]["current_price"]).get_text(strip=True) if product.select_one(selectors[site]["current_price"]) else "N\A",
                            "product_id":product_inserted.inserted_id ,
                            "valid_for":"30 days" 

                      }
                             offer_inserted=insert_offers(offers_data)
                             if offer_inserted:
                                  print("offer data inserted")
                             else:
                                  print("offer not inserted")
                            
                      product_count+=1
                      print("sucessful")

                      
