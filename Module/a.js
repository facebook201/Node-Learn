
console.log('模块a start');

exports.test = 1;

undeclaredVariable = 'a模块未声明变量';

const b = require('./b');

console.log('a 模块加载完毕：b.test的值', b.test);


