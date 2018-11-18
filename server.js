const route = require('koa-route');
const Koa = require('koa');
const auth = require('koa-basic-auth');
const staticCache = require('koa-static-cache');
const send = require('koa-send');
const path = require('path');
const websockify = require('koa-websocket');
const enforceHttps = require('koa-sslify');

const app = websockify(new Koa);

const assetspath = path.join(__dirname, 'public');
app.use(staticCache(assetspath));

if ('dev' !== process.env.NODE_ENV) {
  app.use(enforceHttps({
    trustProtoHeader: true
  }));
}

const roomClients = {};

// websocket
app.ws.use(route.all('/chat/:roomName', function (ctx, roomName) {
  const sendPopulationStat = () => {
    roomClients[`${roomName}`].forEach(function each(client) {
      client.readyState === client.OPEN && client.send(`{"population":${roomClients[`${roomName}`].length}}`);
    });
  }
  if (roomClients[`${roomName}`]) {
    roomClients[`${roomName}`].push(ctx.websocket);
  } else {
    roomClients[`${roomName}`] = [ctx.websocket];
  }

  // ctx.websocket.send(`{"message":"Welcome to Room ${roomName}!","id":"00000000000"}`);

  sendPopulationStat();

  ctx.websocket.on('message', function (message) {
    roomClients[`${roomName}`].forEach(function each(client) {
      client.readyState === client.OPEN && client.send(JSON.stringify(message));
    });
  });

  ctx.websocket.on('close', function (e) {
    const clients = roomClients[`${roomName}`];
    for (let i = clients.length - 1; i >= 0; i--) {
      if (clients[i].readyState === clients[i].CLOSED) {
        clients.splice(i, 1);
      }
    }
    sendPopulationStat();
  });

}));

app.use(function* index() {
  yield send(this, '/public/index.html');
});

app.listen(process.env.PORT || 3000);
console.log(`listening on port ${process.env.PORT || 3000}`);