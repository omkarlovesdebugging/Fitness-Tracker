from pymongo import MongoClient
import sys

def test_mongodb_connection():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/fitness_tracker')
        
        # Get database info
        db = client.get_database()
        
        # Test database operations
        collections = db.list_collection_names()
        
        # Print database info
        print("✅ Successfully connected to MongoDB!")
        print(f"Database name: {db.name}")
        print("\nCollections:")
        for collection in collections:
            print(f"- {collection}: {db[collection].count_documents({})} documents")
            
        return True
        
    except Exception as e:
        print("❌ Failed to connect to MongoDB!")
        print(f"Error: {str(e)}")
        return False
    
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)
