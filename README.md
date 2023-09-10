# Kanban-Board
Kanban Board Task Management Project
This project is a Kanban board web application, which is a popular tool for visualizing and managing tasks or projects in a flow-based manner. Here's a brief overview of the project:

Frontend:

HTML and CSS: The frontend of the application is built using HTML and CSS. It defines the structure and style of the Kanban board, including columns for "To Do," "Doing," and "Done" tasks, a form for adding new tasks, and task cards.

JavaScript: JavaScript is used for client-side scripting to add interactivity and functionality to the Kanban board. It handles drag-and-drop functionality, form submissions for adding and editing tasks, and making API requests to interact with the backend.

Drag-and-Drop: The project implements drag-and-drop functionality to allow users to move tasks between columns on the Kanban board. This involves using the HTML5 draggable attribute and event listeners for drag and drop events.

API Requests: JavaScript makes HTTP requests (GET, POST, PUT, DELETE) to a backend API to perform CRUD (Create, Read, Update, Delete) operations on tasks. The API is expected to run on http://localhost:3000.

Backend (Not Shown):

Express.js: The server-side logic for handling API requests is likely implemented using Express.js, a Node.js web application framework.

MongoDB: The project uses MongoDB as a database to store task-related data. Mongoose, an ODM (Object Data Modeling) library for MongoDB, is used for defining the task schema and interacting with the database.

API Endpoints: The backend defines several API endpoints, such as creating a new task, updating a task's status, editing a task, and deleting a task. These endpoints are accessed via HTTP requests from the frontend.


Here is a screen shot showcasing the user interface:![image](https://github.com/harshith-prog/Kanban-Board/assets/71744833/8b0ff6a5-9a7b-474c-a4ee-413efdce91fa).
