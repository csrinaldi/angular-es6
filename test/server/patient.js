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

var PatientRepository = require('../../server/health/repository/patient');
var HealthInsuranceRepository = require('../../server/health/repository/healthInsurance');

var HealthInsurance = mongoose.model('HealthInsurance');
var Patient = mongoose.model('Patient');
var Contact = mongoose.model('Contact');

var repo = new PatientRepository();
var repoHI = new HealthInsuranceRepository();

describe('Patient Repository', function () {
    describe('Test Save', function () {

        var obj = undefined;
        var errors = undefined;
        beforeEach(function (done) {

            var p = new Patient();
            p.name = "Cristian";
            p.lastName = "Rinaldi";
            p.birthday = new Date("17/07/1981");
            p.gender = "Masculino";
            p.healthInsurance.push("552a51abae3e089e4aab72ac");
            var c = new Contact();
            c.phone = "0342 155238083";
            c.street = "San Juan";
            c.number = "2340";
            c.city = "Santa Fe";
            c.state = "Santa Fe";
            c.block = "7";
            c.dpto = "1";
            c.floor = "1";
            c.cellphone = "54 9 342 5238083";
            c.phone = "342 4582569"
            c.email = "csrinaldi@gmail.com";
            p.contacts.push(c);

            repo.save(p).then(function(data){
               console.log(data);
            });


        });

        it('save with errors', function () {
            console.log(errors);
            console.log(obj);

        });
    });
});
