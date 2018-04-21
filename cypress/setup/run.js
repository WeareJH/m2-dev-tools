module.exports = function(opts, ctx, done) {

    const cypress = require('cypress');
    const connect = require('connect');
    const http = require('http');

    const app = connect();
    app.use(require('serve-static')('./'));
    const server = http.createServer(app);
    server.listen();
    const address = server.address();

    cypress.run({
        spec: 'cypress/integration/keyboard.js',
        env: `TEST_URL=http://localhost:${address.port}/test.html`,
    }).then((results) => {
        server.close();
        if (results.failures > 0) {
            return process.exit(1);
        }
        process.exit(0);
    });
};