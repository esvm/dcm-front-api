const http = require("http");
const grpc = require("grpc");

const apiPackage = require("./proto.js").api;

const grpcHost = process.env.GRPC_HOST || "localhost";
const grpcPort = process.env.GRPC_PORT || 50051;
const topic = process.env.TOPIC_NAME || "iot";

const api = apiPackage.DcmApiDatabaseService(
  `${grpcHost}:${grpcPort}`,
  grpc.credentials.createInsecure()
);

const server = http.createServer((request, response) => {
  console.log("Requested url: " + request.url);

  if (request.url.toLowerCase() === "/events") {
    response.writeHead(200, {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*"
    });

    setTimeout(() => {
      const payload = {
        topic_name: topic,
        minutes_ago: 5
      };
      let items = api.GetItems(payload);
      const response = {
        title: "Average",
        array: items
      };
      response.write(`data: ${JSON.stringify(response)}`);
      response.write("\n\n");
    }, 300);
  } else {
    response.writeHead(404);
    response.end();
  }
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
