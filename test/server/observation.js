var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

mongoose.connect('mongodb://localhost/semmep', function (err, res) {
    if (err) throw err;
    console.log('Connected to Database');
    console.log(res);
});

require('../../server/core/model')(mongoose);
require('../../server/security/models')(mongoose);
require('../../server/human.resource/models')(mongoose);
require('../../server/health/models')(mongoose);

var ObservationRepository = require('../../server/health/repository/observation');
var Observation = mongoose.model('Observation');

var repo = new ObservationRepository();

describe('Observation Repository', function () {
    describe('Test Save', function () {

        var obj = undefined;
        var errors = undefined;
        beforeEach(function(done){

            var o = new Observation();
            o.professional = ObjectID("552a51acae3e089e4aab72bb");
            o.patient = ObjectID("552a51acae3e089e4aab72bc");
            repo.save(o)
                .then(function(value){
                    obj = value;
                    done();
                })
                .catch(function(err){
                    errors = err;
                    done();
                });
        });

        it('save with errors', function () {
            console.log(errors);
            console.log(obj);

        });
    });
});

