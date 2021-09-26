const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node20_mysql",
});

// Route
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});
app.get("/customers", (req, res) => {
  const query = "SELECT * FROM customers";

  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("Not results");
    }
  });
});
app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM customers where id = ${id}`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("Customer not exists");
    }
  });
});

app.post("/add", (req, res) => {
  const sql = `INSERT INTO customers SET ?`;
  const customerObj = {
    name: req.body.name,
    city: req.body.city,
  };

  connection.query(sql, customerObj, (err) => {
    if (err) throw err;
    res.send("Customer created!");
  });
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql = `UPDATE customers SET name = '${name}', city = '${city}' WHERE id = ${id} `;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.send("Customer updated!");
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM customers WHERE id = ${id}`;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.send("Customer deleted");
  });
});
// Check connect
connection.connect((error) => {
  if (error) throw error;
  console.log("Connection OK");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
