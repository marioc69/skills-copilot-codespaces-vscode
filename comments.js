// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

// Create server
http.createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.url === '/comments') {
        if (req.method === 'GET') {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            fs.readFile(path.join(__dirname, 'comments.json'), (err, data) => {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Error');
                } else {
                    res.end(data);
                }
            });
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let comments = [];
                fs.readFile(path.join(__dirname, 'comments.json'), (err, data) => {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end('Error');
                    } else {
                        comments = JSON.parse(data);
                        comments.push(JSON.parse(body));
                        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
                            if (err) {
                                res.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });
                                res.end('Error');
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                res.end(JSON.stringify(comments));
                            }
                        });
                    }
                });
            });
        }
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('Not found');
    }
}).listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Add comments.json file
// Path: comments.json
[]