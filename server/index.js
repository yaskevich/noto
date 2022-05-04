"use strict"

import bodyParser from "body-parser"
// import compression from 'compression';
import express from "express"
import fs from "fs"
import history from "connect-history-api-fallback"
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = await open({ filename: path.join(__dirname, '..', 'data.db'), driver: sqlite3.cached.Database })


const schemePosts = `CREATE TABLE IF NOT EXISTS posts (
  [id] integer NOT NULL PRIMARY KEY UNIQUE,
  [time] TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  [date] DATETIME,
  [title] TEXT,
  [content] TEXT,
  [deleted] BOOLEAN DEFAULT FALSE,
  [faved] BOOLEAN DEFAULT FALSE
  )`;

const schemeCats = `CREATE TABLE IF NOT EXISTS cats (
  [id] integer NOT NULL PRIMARY KEY UNIQUE,
  [title] TEXT
  )`;

const schemePersons = `CREATE TABLE IF NOT EXISTS persons (
  [id] integer NOT NULL PRIMARY KEY UNIQUE,
  [bday] DATETIME,
  [name] TEXT,
  [content] TEXT,
  [deleted] BOOLEAN DEFAULT FALSE
  )`;

const resultPosts = await db.exec(schemePosts);
const resultCats = await db.exec(schemeCats);
const resultPersons = await db.exec(schemePersons);

const app = express()
const port = process.env.PORT || 8080

// app.use(compression());
// app.set('trust proxy', 1);
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(express.static("public"))

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.post("/api/save", async (req, res) => {
  // console.log(req.body)
  // const result = db.data.posts.push({
  //   date: req.body.date,
  //   time: Date.now(),
  // })
  // date('now'),
  const result = await db.run(`INSERT INTO posts (title, content, date) VALUES ( ?, json(?), ?)`, req.body.title, JSON.stringify(req.body.content), req.body.date);
  // console.log("result", result);
  res.json({ id:  result.lastID })
})

app.get("/api/data", async(req, res) => {
  const posts = await db.all(`SELECT * FROM posts`);
  const cats  = await db.all(`SELECT * FROM cats`);
  res.json({posts,  cats})
})

app.get("/api/note", async(req, res) => {
  const id  = req.query.id || 1;
  const note = await db.all(`SELECT * FROM posts WHERE id = ?`, [id]);
  res.json(note.shift());
})

app.post("/api/note", async(req, res) => {
  let response = {};
  console.log("req.body", req.body);
  if (req.body.id) {
    const result = await db.run(`UPDATE posts SET title = ?, date = ?, content = json(?) WHERE id = ?`, [req.body.title, req.body.date, JSON.stringify(req.body.content), req.body.id]);
    response = { id:  req.body.id };
  } else {
    const result  = await db.run(`INSERT INTO posts (title, date, content) VALUES ( ?, ?, json(?))`, [req.body.title, req.body.date, JSON.stringify(req.body.content)]);
    response = { id: result.lastID};
  }
  res.json(response);
})

app.get("/api/persons", async(req, res) => {
  const persons = await db.all(`SELECT * FROM persons`);
  res.json(persons)
})

app.get("/api/person", async(req, res) => {
  const id  = req.query.id || 1;
  const person = await db.all(`SELECT * FROM persons WHERE id = ?`, [id]);
  res.json(person.shift())
})

app.post("/api/person", async(req, res) => {
  let response = {};
  console.log("req.body", req.body);
  if (req.body.id) {
    const result = await db.run(`UPDATE persons SET bday = ?, name = ?, content = json(?) WHERE id = ?`, [req.body.bday, req.body.name, JSON.stringify(req.body.content), req.body.id]);
    response = { id:  req.body.id };
  } else {
    const result  = await db.run(`INSERT INTO persons (bday, name, content) VALUES ( ?, ?, json(?))`, [req.body.bday, req.body.name, JSON.stringify(req.body.content)]);
    response = { id: result.lastID};
  }
  res.json(response);
})

app.get("/api/deadlines", async(req, res) => {
  const deadlines = await db.all(`SELECT * FROM posts where date > date('now')`);
  // console.log(deadlines);
  res.json(deadlines)
})

app.listen(port)
console.log("Running at Port " + port)
