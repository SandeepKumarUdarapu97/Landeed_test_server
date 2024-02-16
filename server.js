const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

app.use(bodyParser.json());

const defaultConfig = {
  "name": "required",
  "gender": "required",
  "age": "required",
  "profession": "required",
  "services": "required",
  "How did you find us":"required",
  "timer": 1
};


app.get('/config', (req, res) => {
  res.json(defaultConfig);
});

app.post('/submit', (req, res) => {

  console.log('submit :-', req);
  const formData = req.body;


  const db = new sqlite3.Database('forms.db');

//Taken AI help
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      gender TEXT,
      age INTEGER,
      profession TEXT,
      services TEXT,
      howFound TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

//Taken AI help
  db.run(
    'INSERT INTO submissions (name, gender, age, profession, services, howFound) VALUES (?, ?, ?, ?, ?, ?)',
    [formData.name, formData.gender, formData.age, formData.profession, formData.services, formData.howFound],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ success: true });
      }
    }
  );

  db.close();
});


app.get('/submissions', (req, res) => {
  const db = new sqlite3.Database('forms.db');

//Taken AI help
  db.all('SELECT * FROM submissions', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });

  db.close();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
