exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL || (process.env.NODE_ENV === 'production' ?
        ENV['PROD_MONGODB'] :
        'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
