from pymongo import MongoClient
from pprint import pprint
import json
from datetime import datetime

def datetime_handler(x):
    if isinstance(x, datetime):
        return x.isoformat()
    raise TypeError(f"Object of type {type(x)} is not JSON serializable")

def view_database_contents():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/fitness_tracker')
        db = client.get_database()
        
        print("\n=== Database Contents ===\n")
        
        # Get all collections
        collections = db.list_collection_names()
        
        if not collections:
            print("No collections found in the database.")
            return
            
        for collection_name in collections:
            print(f"\n📁 Collection: {collection_name}")
            print("=" * 50)
            
            # Get all documents in the collection
            documents = list(db[collection_name].find())
            
            if not documents:
                print("No documents found in this collection.")
                continue
                
            print(f"Found {len(documents)} documents:\n")
            
            for doc in documents:
                # Convert ObjectId to string
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
                    
                # Format the document for pretty printing
                formatted_doc = json.dumps(doc, indent=2, default=datetime_handler)
                print(formatted_doc)
                print("-" * 50)
                
    except Exception as e:
        print(f"❌ Error accessing database: {str(e)}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    view_database_contents()
