const route = require('koa-route');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const auth = require('koa-basic-auth');
const staticCache = require('koa-static-cache');
const send = require('koa-send');
const path = require('path');
const register = require('babel-register');
const websockify = require('koa-websocket');
const app = websockify(new Koa());

// imports babel runtime for JSX views, warning: live transpiling
// best to precompile in production deploys for perf + reliability
// register({
//   presets: [ 'es2015', 'react' ],
//   extensions: [ '.jsx', '.js' ],
// });

const assetspath = path.join(__dirname, 'out');

app.use(staticCache(assetspath));

const db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};

const pets = {
  list: (ctx) => {
    const pets = Object.values(db);
    ctx.body = pets;
  },

  show: (ctx, name) => {
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet.name + ' is a ' + pet.species;
  },

  add: (ctx) => {
    const pet = ctx.request.body;
    const existingPet = db[`${pet.name}`];
    db[`${pet.name}`]= {name: pet.name, species: pet.species}
    if(existingPet){
      ctx.status = 200;
    } else {
      ctx.status = 201;
    }
  }
};

// app.use(auth({ name: 'john', pass: 'doe' }))
// rest apis
app.use(bodyparser());
app.use(route.get('/pets', pets.list));
app.use(route.get('/pets/:name', pets.show));
app.use(route.post('/pets', pets.add))

// websocket
app.ws.use(route.all('/chat', function (ctx) {
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.send('Hello World');
  
  ctx.websocket.on('message', function(message) {
    app.ws.server.clients.forEach(function each(client) {
      client.send(message);
    });
  });
}));

app.use(function* index() {
  yield send(this, '/public/index.html');
});

app.listen(3000);
console.log('listening on port 3000');