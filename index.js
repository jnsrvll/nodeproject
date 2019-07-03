const Joi = require('joi');
const express = require('express');

let apiRoutes = require("./api-routes");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/resthub');

var db = mongoose.connection;


const courses = [
    { id: 1, name: 'course 1'},
    { id: 2, name: 'course 2'},
    { id: 3, name: 'course 3'}
];

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });


app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
});

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    console.log(result);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)    res.status(404).send(`The Course with ${req.params.id} ID was not found.`);
    
    res.send(course);
});

app.put('/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)    res.status(404).send(`The Course with ${req.params.id} ID was not found.`);

    console.log(course);
    const schema = {
        name: Joi.string().min(3).required()
    };
    

    const result = Joi.validate(req.body, schema);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name
    console.log(course);
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)    res.status(404).send(`The Course with ${req.params.id} ID was not found.`);

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
    
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}....`))