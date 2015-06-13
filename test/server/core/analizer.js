var analyzer = require("../../../server/core/rest/analyzer");

describe('Analizer Function', function () {
    describe('Module Analizer to REST Url', function () {
        it('Compile URL With Semantic Exception', function () {
            var fn = function () {
                analyzer.compileURL(
                    "/professionals:(name)/name=Cristian/domainRoles",
                    "/professionals:(name)/name=Cristian/domainRoles"
                )
            };

            expect(fn).to.throw("Semantic Exception: Select and Populate definition Error");
        });
        it('Compile URL With Range Exception', function () {
            var fn = function () {
                analyzer.compileURL(
                    "/professionals::(12-5)/id=5/domainRoles",
                    "/professionals::(12-5)/id=5/domainRoles"
                )
            };

            expect(fn).to.throw("Semantic Exception: id in Expression is incompatible with Range");
        });
        it('Compile URL', function () {
            var result = analyzer.compileURL(
                "/professionals::(12-5)/name=Cristian&lastname=Rinaldi/domainRoles:(name)",
                "/professionals::(12-5)/name=Cristian&lastname=Rinaldi/domainRoles:(name)"
            );

            var target = {
                urlCompiled: '/professionals/&query/domainRoles',
                astCompiled: [
                    {
                        root: 'professionals',
                        range: '(12-5)',
                        select: undefined,
                        sort: undefined,
                        expression: 'name=Cristian&lastname=Rinaldi'
                    },
                    {
                        root: 'domainRoles',
                        range: undefined,
                        select: '(name)',
                        sort: undefined
                    }
                ]
            }
            expect(result).to.eql(target);
        });
    })
});
