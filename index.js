const http = require("http");
const grpc = require("grpc");

const apiPackage = require("./proto.js").api;

const grpcHost = process.env.GRPC_HOST || "104.196.58.169";
const grpcPort = process.env.GRPC_PORT || 50051;
const topic = process.env.TOPIC_NAME || "disk_used";

const api = new apiPackage.DcmApiDatabaseService(
  `${grpcHost}:${grpcPort}`,
  grpc.credentials.createInsecure()
);

const server = http.createServer((request, response) => {
  console.log("Requested url: " + request.url);
  switch (request.url.toLowerCase()) {
    case "/events":
      response.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      });

      const payload = {
        topic_name: topic,
        minutes_ago: 2
      };

      api.GetItems(payload, (err, items) => {
        if (err) {
          console.error(err);
          return;
        }

        const res = {
          title: "metrics",
          ...items
        };

        response.write(`data: ${JSON.stringify(res)}`);
        response.write("\n\n");
        response.end();
      });
      break;
    default:
      response.writeHead(404);
      response.end();
  }
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
