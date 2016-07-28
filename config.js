exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL || (process.env.NODE_ENV === 'production' ?
        process.env.PROD_MONGODB :
        'mongodb://127.0.0.1/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
