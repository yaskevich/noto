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
  [deleted] BOOLEAN DEFAULT FALSE
  )`;

const schemeCats = `CREATE TABLE IF NOT EXISTS cats (
  [id] integer NOT NULL PRIMARY KEY UNIQUE,
  [title] TEXT
  )`;

const resultPosts = await db.exec(schemePosts);
const resultCats = await db.exec(schemeCats);

// const deadlines = await db.all(`SELECT * FROM posts where date > date('now')`);
// console.log(deadlines);

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

app.listen(port)
console.log("Running at Port " + port)
