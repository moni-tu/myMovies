// variable creation
const http = require('http'),
  fs = require('fs'),
  url = require('url');

// server creation
// request.url allows you to get the URL from the request
http.createServer((request, response) => {
    let addr = request.url,
      q = url.parse(addr, true),
      filePath = '';

// (log.txt) Whenever a request is made to the server, you add the visited URL, 
// as well as the timestamp at which the request was received
fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Added to log.');
  }
});

//For incoming requests, parse the request.url to determine if the URL 
// contains the word “documentation”
if (q.pathname.includes('documentation')) {
  filePath = (__dirname + '/documentation.html');
} else {
  //This ensures that, if the user makes a request to a URL that doesn't exist 
  // on your server, they'll simply be returned to your main page.
  filePath = 'index.html';
}
// The fs module uses its readfile() function to grab the appropriate file from the server.
fs.readFile(filePath, (err, data) => {
  if (err) {
    throw err;
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(data);
  response.end();

});

}).listen(8080);
console.log('My test server is running on Port 8080.');






// The first line of code creates a variable called http, then assigns to it an instance of the HTTP module. 
// This is what imports the HTTP module and allows you to use its function createServer()
const http = require('http');

// Following this, the createServer() function is called on the new http variable you’ve created. 
// Within this function is yet another function that has two arguments—request and response. 
//This function will be called every time an HTTP request is made against that server, which is why it’s called the request handler.
http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello Node!\n');
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');