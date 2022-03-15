
'use strict';

const port = 3000;
const http = require('http');
const url = require('url');

const pageHit = new (require('./lib/page-hit'))();
const httpResponse = require('./lib/http-response');

const server = http.createServer((req, res) => {
    const count = pageHit.count(req);

    if (!count) return httpResponse({ res, status: 400, content: 'No referrer' });

    const uri = url.parse(req.url).pathname;
    switch (uri) {
        case '/json':
            httpResponse({
                res,
                mime: 'application/json',
                content: `{"count" : ${count}}`
            });
            break;
        case '/js':
            httpResponse({
                res,
                mime: 'application/javascript',
                content: `${count}`
            });
            break;
        case '/text':
            httpResponse({
                res,
                mime: 'text/plain',
                content: `${count}`
            });
            break;
        default:
            httpResponse({ res, status: 404, content: 'Not found' });
            break;
    }
});

server.listen(port, () => console.log(`Server started on port ${port}`));