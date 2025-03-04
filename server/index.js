'use strict';

import bodyParser from 'body-parser';
// import compression from 'compression';
import express from 'express';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({ filename: path.join(__dirname, '..', 'data.db'), driver: sqlite3.cached.Database });

const schemePosts = `CREATE TABLE IF NOT EXISTS posts (
  [id] integer NOT NULL PRIMARY KEY UNIQUE,
  [time] TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  [alarm] TIMESTAMP,
  [title] TEXT,
  [content] TEXT,
  [deleted] BOOLEAN DEFAULT FALSE,
  [faved] BOOLEAN DEFAULT FALSE,
  [stamped] BOOLEAN DEFAULT FALSE,
  [cat] INTEGER NOT NULL DEFAULT 1
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

const app = express();
const port = process.env.PORT || 8080;

// app.use(compression());
// app.set('trust proxy', 1);
app.use(bodyParser.json({ limit: '50mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.post("/api/save", async (req, res) => {
//   const result = await db.run(`INSERT INTO posts (title, content, alarm) VALUES ( ?, json(?), ?)`, req.body.title, JSON.stringify(req.body.content), req.body.alarm);
//   // console.log("result", result);
//   res.json({ id:  result.lastID })
// })

app.get('/api/data', async (req, res) => {
  const cat = Number(req.query.cat);
  const ext = cat ? 'AND cat = ' + cat : '';
  const sql = `SELECT * FROM posts WHERE deleted IS NOT TRUE ${ext} ORDER BY id DESC`;
  const posts = await db.all(sql);
  const cats = await db.all(`SELECT * FROM cats`);
  res.json({ posts, cats });
});

app.get('/api/cats', async (req, res) => {
  const cats = await db.all(`SELECT * FROM cats`);
  res.json(cats);
});

app.get('/api/note', async (req, res) => {
  const id = req.query.id || 1;
  const note = await db.all(`SELECT * FROM posts WHERE id = ?`, [id]);
  res.json(note.shift());
});

app.post('/api/note', async (req, res) => {
  let response = {};
  console.log('req.body', req.body);
  if (req.body.id) {
    const result = await db.run(`UPDATE posts SET title = ?, alarm = ?, content = json(?), cat = ?, time =?, wholeday=? WHERE id = ?`, [
      req.body.title,
      req.body.alarm,
      req.body.content,
      req.body.cat,
      req.body.time,
      req.body.wholeday,
      req.body.id,
    ]);
    response = { id: req.body.id };
  } else {
    const result = await db.run(
      `INSERT INTO posts (title, alarm, content, stamped, cat, time, wholeday) VALUES ( ?, ?, json(?), ?, ?, ?, ?)`,
      [req.body.title, req.body.alarm || null, JSON.stringify(req.body.content), req.body.stamped, req.body.cat, req.body.time, req.body.wholeday]
    );
    response = { id: result.lastID };
  }
  res.json(response);
});

app.post('/api/fav', async (req, res) => {
  console.log('req.body', req.body);
  const result = await db.run(`UPDATE posts SET faved = ? WHERE id = ?`, [req.body.status, req.body.id]);
  res.json(result);
});

app.get('/api/persons', async (req, res) => {
  const persons = await db.all(`SELECT * FROM persons`);
  res.json(persons);
});

app.get('/api/person', async (req, res) => {
  const id = req.query.id || 1;
  const person = await db.all(`SELECT * FROM persons WHERE id = ?`, [id]);
  res.json(person.shift());
});

app.post('/api/person', async (req, res) => {
  let response = {};
  console.log('req.body', req.body);
  if (req.body.id) {
    const result = await db.run(`UPDATE persons SET bday = ?, name = ?, content = json(?) WHERE id = ?`, [
      req.body.bday,
      req.body.name,
      JSON.stringify(req.body.content),
      req.body.id,
    ]);
    response = { id: req.body.id };
  } else {
    const result = await db.run(`INSERT INTO persons (bday, name, content) VALUES ( ?, ?, json(?))`, [
      req.body.bday,
      req.body.name,
      JSON.stringify(req.body.content),
    ]);
    response = { id: result.lastID };
  }
  res.json(response);
});

app.get('/api/deadlines', async (req, res) => {
  const deadlines = await db.all(`SELECT * FROM posts where alarm > datetime('now', '-30 day') AND deleted IS NOT TRUE`);
  res.json(deadlines);
});

app.get('/api/dated', async (req, res) => {
  const posts = await db.all(`SELECT * FROM posts WHERE (stamped = 1 OR alarm is not null) AND deleted IS NOT TRUE`);
  res.json(posts);
});

app.delete('/api/note/:id', async (req, res) => {
  const id = Number(req.params.id);
  res.json(id ? await db.run(`UPDATE posts SET deleted = 1 WHERE id = ?`, [id]) : {});
});

app.listen(port);
console.log('Running at Port ' + port);
