const http = require("http");

http
  .createServer((request, response) => {
    console.log("Requested url: " + request.url);

    if (request.url.toLowerCase() === "/events") {
      response.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      });

      setTimeout(() => {
        response.write('data: {"title": "Média", "array": [5000, 3000, 3500, 650, 200]}');
        response.write("\n\n");
      }, 3000);

      setTimeout(() => {
        response.write('data: {"title": "Média", "array": [50, 30, 30, 0, 0]}');
        response.write("\n\n");
      }, 6000);
    } else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(8080, () => {
    console.log("Server running at http://127.0.0.1:8080/");
  });
