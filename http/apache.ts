
const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = 8000;
const imageDir = __dirname + '/images';


const server = http.createServer((request, response) => {
    const url = request.url;
    const _path = path.join(imageDir, url);

    fs.exists(_path, (exists) => {
        if (exists) {
            response.statusCode = 200;
            response.setHeader('Content-Type', `images/${path.extname(url).replace('.', '')}`);
            fs.createReadStream(_path).pipe(response);
        } else {
            response.statusCode = 404;
            response.end('Not Found!');
        }
    });
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
})
