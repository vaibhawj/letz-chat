const route = require('koa-route');
const Koa = require('koa');
const auth = require('koa-basic-auth');
const staticCache = require('koa-static-cache');
const send = require('koa-send');
const path = require('path');
const websockify = require('koa-websocket');
const app = websockify(new Koa());

const assetspath = path.join(__dirname, 'out');

app.use(staticCache(assetspath));

// app.use(auth({ name: 'john', pass: 'doe' }))

const roomClients = {};

// websocket
app.ws.use(route.all('/chat/:roomName', function (ctx, roomName) {
  const clients = roomClients[`${roomName}`];
  if(clients) {
    clients.push(ctx.websocket);
  } else {
    roomClients[`${roomName}`] = [ctx.websocket];
  }

  ctx.websocket.send('Hello from server!');
  
  ctx.websocket.on('message', function(message) {
    roomClients[`${roomName}`].forEach(function each(client) {
      client.send(message);
    });
  });
}));

app.use(function* index() {
  yield send(this, '/public/index.html');
});

app.listen(3000);
console.log('listening on port 3000');