
const EventEmitter = require('events');


const myEmitter = new EventEmitter();

myEmitter.on('event', (a, b) => {
    console.log(a, b, this);
});

myEmitter.emit('event', 'a', 'b');