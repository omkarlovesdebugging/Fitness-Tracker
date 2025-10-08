import os

class Config:
    # Flask configuration
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    # MongoDB configuration
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://gholapomkar211004:4NlMtgAy7xi5FLEF@fitness.5hmdrtm.mongodb.net/?retryWrites=true&w=majority&appName=Fitness')
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    MONGO_URI = os.environ.get('MONGO_URI_TEST', 'mongodb+srv://gholapomkar211004:4NlMtgAy7xi5FLEF@fitness.5hmdrtm.mongodb.net/?retryWrites=true&w=majority&appName=Fitness')

class ProductionConfig(Config):
    DEBUG = False
    # Ensure strong secret keys are set in environment
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}