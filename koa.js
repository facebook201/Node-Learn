const Koa = require('koa');
const app = new Koa();

debugger;

app.use(ctx => {
    ctx.body = 'Hello World!';
});

app.listen(3000);

