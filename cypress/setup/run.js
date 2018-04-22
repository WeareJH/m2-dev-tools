const {from} = require('rxjs/observable/from');
const {concatMap} = require('rxjs/operators/concatMap');
const {reduce} = require('rxjs/operators/reduce');
const {tap} = require('rxjs/operators/tap');

module.exports = function(opts, ctx, done) {

    const cypress = require('cypress');
    const connect = require('connect');
    const http = require('http');

    const app = connect();
    app.use(require('serve-static')('./'));
    const server = http.createServer(app);
    server.listen();
    const address = server.address();

    from(opts.specs).pipe(
        concatMap(path => cypress.run({
            spec: path,
            env: `TEST_URL=http://localhost:${address.port}/test.html`,
        })),
        reduce((sum, item) => sum + item.failures,  0),
        tap(() => server.close())
    ).subscribe((failures) => {
        if (failures > 0) {
            done(new Error('Failures'))
        } else {
            done()
        }
    }, (err) => {
        done(new Error(err));
    }, () => {
        done();
    });
};
