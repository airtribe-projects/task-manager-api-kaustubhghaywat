const express = require('express');
const fs = require('fs')
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/tasks/', (req, res) =>
    fs.readFile('task.json', 'utf8', (err, data) => {
        const tasksObj = JSON.parse(data);
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading tasks');
        }
        res.send(tasksObj.tasks);
    })
);

app.get('/tasks/:id', (req, res) =>
    fs.readFile('task.json', 'utf8', (err, data) => {
        const tasksObj = JSON.parse(data);
        const id = parseInt(req.params.id);
        const task = tasksObj.tasks.find(t => t.id === id);

        if (err) {
            return res.status(500).send('Error reading tasks');
        }
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);
    })
);


app.post('/tasks/', (req, res) => {
    // First read the existing tasks
    fs.readFile('task.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error reading tasks');
        }

        const tasksObj = JSON.parse(data);
        const task = req.body;
        task.id = tasksObj.tasks.length + 1;

        tasksObj.tasks.push(task);

        fs.writeFile('task.json', JSON.stringify(tasksObj, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error saving task');
            }
            res.status(201).send(task);
        });
    });
});


app.put('/tasks/:id', (req, res) => {
    fs.readFile('task.json', 'utf8', (err, data) => {
        const tasksObj = JSON.parse(data);
        const id = parseInt(req.params.id);
        const task = tasksObj.tasks.find(t => t.id === id);

        task.title = req.body.title;
        task.description = req.body.description;
        task.completed = req.body.completed;

        fs.writeFile('task.json', JSON.stringify(tasksObj, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error saving task');
            }
            res.status(201).send(task);
        });
    });
})


app.delete('/tasks/:id', (req, res) => {
    fs.readFile('task.json', 'utf8', (err, data) => {
        const tasksObj = JSON.parse(data);
        const id = parseInt(req.params.id);
        const taskIndex = tasksObj.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return res.status(404).send('Task not found');
        }   
        tasksObj.tasks.splice(taskIndex, 1);

        fs.writeFile('task.json', JSON.stringify(tasksObj, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error deleting task');
            }
            res.status(201).send('Task deleted');
        });
    });
});


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;