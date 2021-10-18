
const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');
const { HttpError } = require('http-errors');

module.exports = class Application extends Emitter {
    constructor(options) {
        super();
        options = options || {};
        this.proxy = options.proxy || false;
        this.subdomainOffset = options.subdomainOffset || 2;
        this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
        this.maxIpsCount = options.maxIpsCount || 0;

        this.env = options.env || 'development';
        if (options.keys) this.keys = options.keys;

        this.middleware = [];
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);

        if (util.inspect.custom) {
            this[util.inspect.custom] = this.inspect;
        }
    }

    // http.createServer(app.callback()).listen(...)
    listen(...agrs) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }

    toJSON() {
        return only(this, [
            'subdomainOffset',
            'proxy',
            'env'
        ]);
    }


    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function')

        this.middleware.push(fn);
        return this;
    }

    // * 返回一个请求处理的 回调 来自原生 node http server
    callback() {
        const fn = compose(this.middleware);

        if (!this.listenerCount('error')) this.on('error', this.onerror);

        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };
        return handleRequest;
    }

    // * 处理请求的回调
    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;

        const onerror = err => ctx.onerror(err);
        const handleResponse = () => response(ctx);
        onFinished(res, onerror);

        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }

    // 初始化一个 context 上下文
    createContext(req, res) {
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);

        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;

        request.response = response;
        response.request = request;

        context.originalUrl = request.originalUrl = req.url;
        context.status = {};

        return context;
    }

    onerror(err) {
        const isNativeError =
            Object.prototype.toString.call(err) === '[object Error]' ||
            err instanceof Error;
        if (!isNativeError) throw new TypeError(util.format('non-error thrown: %j', err));

        if (404 === err.status || err.expose) return;
        if (this.slient) return;

        const msg = err.stack || err.toString();
    }
}

function respond(ctx) {
    if (false === ctx.respond) return;

    if (!ctx.writable) return;
    const res = ctx.res;

    let body = ctx.body;
    const code = ctx.status;

    if (statuses.empty[code]) {
        ctx.body = null;
        return res.end();
    }

    if ('HEAD' === ctx.method) {
        if (!res.headersSent && !ctx.response.has('Content-Length')) {
            const { length } = ctx.response;
            if (Number.isInteger(length)) ctx.length = length;
        }
        return res.end();
    }

    if (null == body) {
        if (ctx.response._explictiNullBody) {
            ctx.response.remove('Content-Type');
            ctx.response.remove('Transfer-Encoding ');
        }
    }

}

module.exports.HttpError = HttpError;






