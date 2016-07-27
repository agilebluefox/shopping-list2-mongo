exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL || (process.env.NODE_ENV === 'production' ?
        'mongodb://user:33tFkdASta4OI2hV1m@ds031845.mlab.com:31845/agilebluefox-shopping-li' :
        'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
