var app = require("http").createServer(handler);
var io = require("socket.io")(app);
var fs = require("fs");

// HTTP サーバのポートを指定する
app.listen(80);

function handler(req, res) {
  fs.readFile(__dirname + "/index.html", function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on("connection", function (socket) {
  console.log("[websocket] connected");

  // クライアントへデータ送信
  // emit を使うとイベント名を指定できる
  setInterval(function () {
    socket.emit("to_client_01", {
      welcome: "Hello, World!",
      now: new Date(),
    });
  }, 3000);

  //   setInterval(function () {
  //     socket.emit("to_client_02", {
  //       welcome: "[to_client_02]",
  //       now: new Date(),
  //     });
  //   }, 7000);

  // クライアントから受け取ったデータを出力する
  socket.on("from_client_01", function (data) {
    console.log("From Client 01: ", data);
  });

  socket.on("from_client_02", function (data) {
    console.log("From Client 02: ", data);
  });

  socket.on("heartbeat", function (data) {
    console.log("heartbeat: ", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("[websocket] disconnect");
  });
});
