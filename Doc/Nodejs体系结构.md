#### Libuv

libuv 中有一个操作句柄，包含了存储数据和回调函数之类的信息。在使用之前 添加到对应的队列。其他句柄使用队列的数据进行存储。 libuv 在进行每一次时间轮询的时候 都会从每个类型的句柄中 取出关联的队列进行处理



![border](https://github.com/yunnysunny/nodebook/raw/master/text/images/uv_run.png)





libuv 线程模型。

* 事件轮询线程 （单线程）跟V8 是同一个线程，
* 一个是文件 IO 处理线程，可处理文件 IO，DNS解析，也可处理用户自己编写的 node扩展。



```js
var fs = require('fs');

fs.exists(__filename, function (exists) {
  console.log(exists);
});
```

![border](https://github.com/yunnysunny/nodebook/raw/master/text/images/fs_io_flow.png)





#### Stream 流的原理

设计流的目的是为了节流，处理内存中大量的数据，防止挤压的数据过多 造成内存的崩溃。Stream 是一个缓冲地带。（功能上 分 Writable 和 Readable） 初始化的时候 指定一个 highWaterMark 参数，约定缓冲区的长度 超过 就不在往里面添加数据。



Readable 通过 push 函数添加数据，在其内部存储一个 双向链接的数据结构，如果当前链表的数据长度到 highWaterMark， push 就会返回 false，不过你依然可以调用 `push` 写入数据。有就是说内部链表的数据长度会大于 `highWaterMark`，Node 内部对于可读流的内存控制完全交给了调用者本身，这个 `highWaterMark` 就是一个警示作用，告诉你现在缓冲区已经满了，你自己看着办吧，如果你不理会，继续往里面写，撑爆了内存是你自己的责任，于我无关。



































































