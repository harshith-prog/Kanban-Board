const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/kanban-board', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String
});

const Task = mongoose.model('Task', taskSchema);


app.post('/api/tasks', (req, res) => {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newTask = new Task({
        title,
        description,
        status
    });

    newTask.save()
        .then(task => {
            res.status(201).json(task);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error creating task.' });
        });
});


app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    Task.findByIdAndUpdate(taskId, { title, description, status }, { new: true })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task not found.' });
            }
            res.json(updatedTask);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error updating task.' });
        });
});


app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    Task.findByIdAndRemove(taskId)
        .then(deletedTask => {
            if (!deletedTask) {
                return res.status(404).json({ error: 'Task not found.' });
            }
            res.sendStatus(204);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error deleting task.' });
        });
});


app.put('/api/tasks/:id/status', (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status field is required.' });
    }

    Task.findByIdAndUpdate(taskId, { status }, { new: true })
        .then(updatedTask => {
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task not found.' });
            }
            res.json(updatedTask);
        })
        .catch(err => {
            res.status(500).json({ error: 'Error updating task status.' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
