var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var Item = require('./models/item');

app.get('/items', function (req, res) {
     Item.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
     });
});

app.post('/items', function (req, res) {
     Item.create({
        name: req.body.name
     }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
     });
});

app.delete('/items/:id', function(req, res) {
    var id = req.body.id;
    Item.findByIdAndRemove(id, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Could not delete requested item'
            });
        }
        res.status(200).json(item);
    });
});

app.put('/items/:id', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    Item.findByIdAndUpdate(id, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Could not update requested item'
            });
        }
        res.status(201).json(item);
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

var runServer = function (callback) {
     mongoose.connect(config.DATABASE_URL, function (err) {
          if (err && callback) {
            return callback(err);
          }

          app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
          });
     });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.log(err);
        }
    });
};

exports.app = app;
exports.runServer = runServer;