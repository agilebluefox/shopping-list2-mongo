global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function () {
    before(function (done) {
        server.runServer(function () {
            Item.create({ name: 'Broad beans' }, { name: 'Tomatoes' }, { name: 'Peppers' },
                function () {
                    done();
                });
        });
    });

    after(function (done) {
        Item.remove(function () {
            done();
        });
    });

    it('should list items on GET', function (done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.be.a('string');
                done();
            });
    });

    it('should add an item on post', function (done) {
        chai.request(app)
            .post('/items')
            .send({ 'name': 'Kale' })
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });

    it(
        'should report an error if the item name is missing when adding an item',
        function (done) {
            chai.request(app)
                .post('/items')
                .send({})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.should.be.json;
                    done();
                });
        });

    it('should edit an item on put', function (done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                var id = res.body[1]._id;
                chai.request(app)
                    .put('/items')
                    .send({ 'id': id, 'name': 'Milk' })
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        should.equal(err, null);
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property(
                            'name');
                        res.body.should.have.property(
                            '_id');
                        res.body._id.should.be.a(
                            'string');
                        res.body._id.should.equal(id);
                        res.body.name.should.equal(
                            'Milk');
                        done();
                    });
            });
    });

    it(
        'should report an error when updating an item that does not exist',
        function (done) {
            chai.request(app)
                .put('/items')
                .send({ 'id': 23, 'name': 'Unknown' })
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.should.be.json;
                    res.body.message.should.equal(
                        'Id not found');
                    done();
                });
        });

    it(
        'should report an error when the update is missing the name or id property',
        function (done) {
            chai.request(app)
                .put('/items')
                .send({})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.should.be.json;
                    res.body.message.should.equal(
                        'Missing required parameter');
                    done();
                });
        });

    it('should delete an item on delete', function (done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                console.log(res.body);
                var id = res.body[2]._id;
                var name = res.body[2].name;
                chai.request(app)
                    .delete('/items')
                    .send({ 'id': id })
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property(
                            'name');
                        res.body.should.have.property(
                            '_id');
                        res.body.name.should.be.a(
                            'string');
                        res.body._id.should.be.a(
                            'string');
                        res.body._id.should.equal(id);
                        res.body.name.should.equal(
                            name);
                        done();
                    });
            });
    });

    it(
        'should report an error when deleting an item that does not exist',
        function (done) {
            chai.request(app)
                .delete('/items')
                .send({ 'id': 23 })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(500);
                    res.body.message.should.equal(
                        'Could not delete requested item');
                    done();
                });
        });

    it('should not delete any items if the id is missing',
        function (done) {
            chai.request(app)
                .delete('/items')
                .send({ 'id': '' })
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.should.be.json;
                    done();
                });
        });
});
