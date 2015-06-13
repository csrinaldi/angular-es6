var translate = require("../../../server/core/rest/mongoseetranslate");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/semmep', function (err, res) {
    if (err) throw err;
    console.log('Connected to Database');
    console.log(res);
});

require('../../../server/core/model')(mongoose);
require('../../../server/security/models')(mongoose);
require('../../../server/human.resource/models')(mongoose);
require('../../../server/health/models')(mongoose);

var model = mongoose.model('Professional');

describe('Translate Function', function () {
    describe('Module translate to MongoDB', function () {
        it('SelectExpression With non existent parameters', function () {

            var obj = new Object();
            obj.whiteList = new Array();
            obj.query = new Array();
            obj.populate = {};

            translate.selectExpression(model, "(pepe,pepe.n,employee.user.name)", obj)

            var target = {
                whiteList: ['employee', 'employee.user'],
                query: ['employee'],
                populate: {
                    employee: {select: "user"},
                    'employee.user': {select: "name"}
                }
            }
            expect(obj).to.eql(target);
        });
        it('SelectExpressionWithBlanks', function () {
            var obj = new Object();
            obj.whiteList = new Array();
            obj.query = new Array();
            obj.populate = {};

            translate.selectExpression(model,
                "(   employee.user.name,   employee,    domainRole)",
                obj);

            var target = {
                whiteList: ['employee', 'employee.user', 'domainRole'],
                query: ['employee', 'domainRole'],
                populate: {
                    employee: {select: "user"},
                    'employee.user': {select: "name"},
                    domainRole: {}
                }
            }

            expect(obj).to.eql(target);

        });
        it('SelectExpressionWithManyPropertyNestedArray', function () {
            var obj = new Object();
            obj.whiteList = new Array();
            obj.query = new Array();
            obj.populate = {};

            translate.selectExpression(model,
                "(employee.user.name,employee,domainRole.domainRole.menues)",
                obj);

            var target = {
                whiteList: ['employee', 'employee.user', 'domainRole', 'domainRole.domainRole', 'domainRole.domainRole.menues'],
                query: ['employee', 'domainRole'],
                populate: {
                    employee: {select: "user"},
                    'employee.user': {select: "name"},
                    domainRole: {select: "domainRole"},
                    'domainRole.domainRole': {select: "menues"},
                    'domainRole.domainRole.menues': {}
                }
            }
            expect(obj).to.eql(target);

        });
        it('DoSubSelectExpr', function () {

            var obj = new Object();
            obj.whiteList = new Array();
            obj.query = new Array();
            obj.populate = {};

            prop = "employee.user.name";
            translate.subSelectExpr(model, prop, obj, "");
            prop = "employee.user";
            translate.subSelectExpr(model, prop, obj, "");
            prop = "workModule";
            translate.subSelectExpr(model, prop, obj, "");
            prop = "workModule";
            translate.subSelectExpr(model, prop, obj, "");
            prop = "domainRole";
            translate.subSelectExpr(model, prop, obj, "");

            var target = {
                whiteList: ['employee', 'employee.user', 'domainRole'],
                query: ['employee', 'workModule', 'domainRole'],
                populate: {
                    employee: {select: "user"},
                    'employee.user': {select: "name"},
                    domainRole: {}
                }
            }

            expect(obj).to.eql(target);
        })

        it('translate.rewrite', function () {
            var result = translate.rewriteSelect("(name,employee.name,domain.finder.load)", "first.second");
            var target = "(first.second.name,first.second.employee.name,first.second.domain.finder.load)";
            expect(result).to.equal(target);
        });

        it('translate.processAst', function () {
            var astCompiled = [
                {
                    root: 'professionals',
                    range: '(12-5)',
                    select: undefined,
                    sort: undefined,
                    expression: 'name=Cristian&lastname=Rinaldi'
                },
                {
                    root: 'domainRole',
                    range: undefined,
                    select: '(domainRole.name)',
                    sort: undefined
                }
            ]
            var result = translate.processAst(astCompiled);
            //expect(result).to.equal(target);
        })
    });
    describe('Process Expression', function () {
        it('Process blank Expression', function () {
            var obj = new Object();
            obj.whiteList = new Array();
            obj.query = new Array();
            obj.populate = {};
            obj.where = {};
            translate.processExpression(model, "_id=1233211235484213", obj);
            expect(obj.where.eq).to.not.equal(undefined);
            expect(obj.where.eq.length).to.equal(1);
        })
    });
    describe('Make Query and Run', function () {
        var resultQuery = null;
        beforeEach(function (done) {
            var target = {
                where : {
                    eq : [ {param : '_id' , value : '552a51acae3e089e4aab72bb'} ]
                },
                whiteList: ['employee', 'employee.user', 'domainRole, patients', 'patients.patient'],
                query: ['employee', 'workModule', 'domainRole, patients'],
                populate: {
                    employee: {select: "user"},
                    'employee.user': {select: "name"},
                    domainRole: {},
                    patients: { select :"patient"},
                    'patients.patient' : { select : 'name'}
                }
            }
            var query = translate.makeQuery(model, target);

            console.log(query);

            query.exec(function (err, result) {
                resultQuery = result;
                done();
            })
        });
        describe('#Check query result', function (done) {
            it('find without errors', function (done) {
                console.log(resultQuery);
                done();
            })
        })
    })

    describe('Test Middleware', function () {
        var httpMocks = require('node-mocks-http');
        var analyzer = require('../../../server/core/rest/analyzer');
        var req, res;

        beforeEach(function (done) {

            req = httpMocks.createRequest({
                method: 'GET',
                url: '/professionals'
            });

            req.criteria = [
                {
                    root: 'professionals',
                    range: undefined,
                    select: undefined,
                    sort: undefined,
                    expression: '_id=552a51acae3e089e4aab72bb'
                },
                {
                    root: 'domainRoles',
                    range: undefined,
                    select: '(name)',
                    sort: undefined
                }
            ]

            res = httpMocks.createResponse();

            done();

        });

        describe('middleware', function (done) {
            it('resolve query', function () {
                translate.mdl(req, res, function () {
                    expect(req.restQuery).to.not.equal(null);
                    return done;
                });

            });
        });

    });
});
