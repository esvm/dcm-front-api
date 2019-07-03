const http = require("http");
const url = require("url");
const grpc = require("grpc");

const apiPackage = require("./proto.js").api;

const grpcHost = process.env.GRPC_HOST || "104.196.58.169";
const grpcPort = process.env.GRPC_PORT || 50051;
const topic = process.env.TOPIC_NAME || "disk_used";
const minutesAgo = process.env.MINUTES_AGO || 2;

const api = new apiPackage.DcmApiDatabaseService(
  `${grpcHost}:${grpcPort}`,
  grpc.credentials.createInsecure()
);

const server = http.createServer((request, response) => {
  const url_parts = url.parse(request.url, true);
  console.log("Requested url: " + url_parts.pathname);

  switch (url_parts.pathname) {
    case "/events":
      response.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*"
      });

      const payload = {
        topic_name: topic,
        minutes_ago: url_parts.query.time_ago || minutesAgo
      };

      console.log(payload);

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
