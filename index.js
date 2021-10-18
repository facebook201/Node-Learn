const express = require('express');
const morgan = require('morgan');
const course = require('./routes/courses');

const app = express();

const dev = app.get('env');
// * 开发环境
if (dev === 'development') {
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use('/api/courses', course);

app.listen(8000, () => 'server is running!');
