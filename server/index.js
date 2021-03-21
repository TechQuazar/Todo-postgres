const express = require('express');
const cors = require('cors');
const pool = require('./db');
//to allow cors
const app = express();

app.use(cors());
app.use(express.json());

//routes

//Create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo');
    res.status(200).send(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    const singleTodo = await pool.query(
      'SELECT * FROM todo WHERE todo_id = $1',
      [req.params.id]
    );
    if (!singleTodo.rows[0]) {
      res.status(404).send('Todo not found');
    }
    res.status(200).send(singleTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { description } = req.body;
    const updateTodo = await pool.query(
      'UPDATE todo SET description=$1 WHERE todo_id=$2 RETURNING *',
      [description, req.params.id]
    );
    res.status(200).send(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleteTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id =$1 RETURNING *',
      [req.params.id]
    );
    res.status(200).send(deleteTodo.rows[0]);
  } catch (error) {
    console.error(error.messagej);
  }
});

app.listen(5000, () => {
  console.log('Server started at port 5000');
});
