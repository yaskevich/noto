"use strict"

import bodyParser from "body-parser"
// import compression from 'compression';
import express from "express"
import fs from "fs"
import history from "connect-history-api-fallback"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { LowSync, JSONFileSync } from "lowdb"

const db = new LowSync(
  new JSONFileSync(path.join(__dirname, "..", "storage.json"))
)
db.read()

if (!db.data) {
  db.data ||= { posts: [], cats: ["unsorted", "words", "links", "ideas", ] }
}
// db.write();

console.log("data", db.data)

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
  console.log(req.body)
  const uid = uuidv4()
  const result = db.data.posts.push({
    content: req.body.text,
    deleted: false,
    time: Date.now(),
    id: uid,
  })
  console.log(result)
  // const result = await db....(req.body.id, req.body.en, req.body.ru);
  // res.json(result);
  db.write()
  res.json({ id: uid })
})

app.get("/api/data", (req, res) => {
  res.json({ data: db.data })
})

app.listen(port)
console.log("Running at Port " + port)
