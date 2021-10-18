
const methods = require('methods');
const compose = require('koa-compose');


module.exports = Router;


function Router(opts) {
    if (!(this instanceof Router)) return new Router(opts);

    this.opts = opts = {};
    this.methods = this.opts.methods || [
        'HEAD',
        'OPTIONS',
        'GET',
        'PUT',
        'PATCH',
        'POST',
        'DELETE'
    ];

    this.params = {};
    this.stack = [];
}

for (let i = 0; i < methods.length; i++) {
    function setMethodVerb(method) {
      Router.prototype[method] = function(name, path, middleware) {
        if (typeof path === "string" || path instanceof RegExp) {
          middleware = Array.prototype.slice.call(arguments, 2);
        } else {
          middleware = Array.prototype.slice.call(arguments, 1);
          path = name;
          name = null;
        }
  
        this.register(path, [method], middleware, {
          name: name
        });
  
        return this;
      };
    }
    setMethodVerb(methods[i]);
}

Router.prototype.del = Router.prototype['delete'];


































