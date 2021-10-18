
* Node 的每一个文件是一个单独的模块，相互不影响。
* 每个文件都有一个 module变量 是独一无二的， 有单独的 id



```javascript
const os = require('os');

const totalMemory = os.totalmem(); // 总内存
const freeMemory = os.freemem(); // 空闲内存

console.log(`Total Memory: ${totalMemory}`);
console.log(`free Memory: ${freeMemory}`);
```








