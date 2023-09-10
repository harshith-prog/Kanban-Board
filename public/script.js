document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const todoTasks = document.getElementById('todo-tasks');
    const doingTasks = document.getElementById('doing-tasks');
    const doneTasks = document.getElementById('done-tasks');

    // Store the current task being edited
    let editingTaskId = null;

    // Function to handle the dragstart event
    function drag(event) {
        event.dataTransfer.setData("taskId", event.target.getAttribute("data-task-id"));
        event.dataTransfer.setData("status", event.target.getAttribute("data-status"));
    }

    // Function to allow elements to be dropped into this target
    function allowDrop(event) {
        event.preventDefault();
    }

    // Function to handle the drop event
    function drop(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("taskId");
        if (!taskId) {
            console.error("taskId is null or empty.");
            return;
        }
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);

        // Determine the target column based on the drop target's ID
        const targetColumnId = event.target.closest('.column').id;

        // Update the task status based on the target column
        let newStatus;
        switch (targetColumnId) {
            case "todo-column":
                newStatus = "To Do";
                break;
            case "doing-column":
                newStatus = "Doing";
                break;
            case "done-column":
                newStatus = "Done";
                break;
            default:
                newStatus = "To Do";
                break;
        }

        const currentStatus = taskCard.getAttribute('data-status');
        if (currentStatus !== newStatus) {
            // Update the task status in the database
            updateTaskStatus(taskId, newStatus);
    
            // Remove the task from the previous category
            const previousColumnId = taskCard.parentElement.parentElement.id;
            const previousColumn = document.getElementById(previousColumnId);
            previousColumn.querySelector(`[data-task-id="${taskId}"]`).remove();
    
            // Append the task to the new category
            if (targetColumnId === "todo-column") {
                todoTasks.appendChild(taskCard);
            } else if (targetColumnId === "doing-column") {
                doingTasks.appendChild(taskCard);
            } else if (targetColumnId === "done-column") {
                doneTasks.appendChild(taskCard);
            }
    
            // Update the task status attribute
            taskCard.setAttribute('data-status', newStatus);
        }
    }

    // Add event listeners to the columns to allow dropping
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', allowDrop);
        column.addEventListener('drop', drop);
    });

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;

        if (editingTaskId) {
            // If editing an existing task, send a PUT request to update it
            fetch(`/api/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, status }),
            })
            .then(response => response.json())
            .then(task => {
                updateTaskCard(task);
                taskForm.reset();
                editingTaskId = null;
            })
            .catch(error => console.error('Error updating task:', error));
        } else {
            fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, status }),
            })
            .then(response => response.json())
            .then(task => {
                const taskCard = createTaskCard(task);
                if (task.status === 'To Do') {
                    todoTasks.appendChild(taskCard);
                } else if (task.status === 'Doing') {
                    doingTasks.appendChild(taskCard);
                } else if (task.status === 'Done') {
                    doneTasks.appendChild(taskCard);
                }
                taskForm.reset();
            })
            .catch(error => console.error('Error adding task:', error));
        }
    });

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('data-task-id', task._id); 
        card.setAttribute('data-status', task.status);
    
        const titleElement = document.createElement('h3');
        titleElement.textContent = task.title;
    
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = task.description;
    
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
    
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'Edit';
        editButton.setAttribute('data-task-id', task._id); // Set the data-task-id attribute for the Edit button
    
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-task-id', task._id); // Set the data-task-id attribute for the Delete button
    
        // Append the elements to the card
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        card.appendChild(titleElement);
        card.appendChild(descriptionElement);
        card.appendChild(taskActions);
    
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('edit-button')) {
                // Edit button clicked
                const taskId = e.target.getAttribute('data-task-id');
                editingTaskId = taskId;
                const task = getTaskById(taskId);
                if (task) {
                    // Populate form with task data
                    document.getElementById('title').value = task.title;
                    document.getElementById('description').value = task.description;
                    document.getElementById('status').value = task.status;
                }
            } else if (e.target.classList.contains('delete-button')) {
                // Delete button clicked
                const taskId = e.target.getAttribute('data-task-id');
                deleteTask(taskId);
            }
        });

        // Add the drag event listener to the task card
        card.addEventListener('dragstart', drag);

        return card;
    }

    function updateTaskCard(updatedTask) {
        const taskCard = document.querySelector(`[data-task-id="${updatedTask._id}"]`);
        
        if (taskCard) {
            const titleElement = taskCard.querySelector('h3');
            const descriptionElement = taskCard.querySelector('p');
            
            if (titleElement && descriptionElement) {
                titleElement.textContent = updatedTask.title;
                descriptionElement.textContent = updatedTask.description;
                
                taskCard.dataset.status = updatedTask.status;
            } else {
                console.error("Error: Elements not found in task card.");
            }
        } else {
            console.error("Error: Task card not found.");
        }
    }

    function getTaskById(id) {
        const taskCards = document.querySelectorAll('.task-card');
        for (const card of taskCards) {
            if (card.querySelector('.edit-button').getAttribute('data-task-id') === id) {
                return {
                    _id: id,
                    title: card.querySelector('h3').textContent,
                    description: card.querySelector('p').textContent,
                    status: card.querySelector('.delete-button').getAttribute('data-status'),
                };
            }
        }
        return null;
    }

    function deleteTask(id) {
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            const taskCards = document.querySelectorAll('.task-card');
            taskCards.forEach(card => {
                if (card.querySelector('.delete-button').getAttribute('data-task-id') === id) {
                    card.remove();
                }
            });
        })
        .catch(error => console.error('Error deleting task:', error));
    }

    function updateTaskStatus(taskId, newStatus) {
        fetch(`/api/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(response => response.json())
        .then(updatedTask => {
            console.log('Task status updated in the server:', updatedTask);
        })
        .catch(error => console.error('Error updating task status:', error));
    }
});
