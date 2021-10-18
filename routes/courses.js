
const express = require('express');
const Joi = require('joi');

const router = express.Router();

const courses = [
    {id: 1, name: 'English' },
    {id: 2, name: 'Math' }
];

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/', (req, res) => {
    res.send(courses);
});

// * post 请求
router.post('', (req, res) => {

});

router.put('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not Found!');

    const result = validateCourse(res.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    // * 校验成功之后 再赋值
    course.name = res.body.name;
    res.send(courses);
});

// * 校验参数 校验 res.body.name 属性值
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// delete 
router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id, 10));
    if (!course) res.status(404).send('The course with the given ID was not found');
    // look up the course
    // Not existing return 404
    // Delete
    const index = courses.indexOf(course);
    console.log(index);
    courses.splice(index, 1);
    // Return the same course
    res.send(courses);
});


module.exports = router;



