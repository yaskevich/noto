'use strict';

import bodyParser from 'body-parser';
// import compression from 'compression';
import express from 'express';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const app = express();
  const port = process.env.PORT || 8080;

  // app.use(compression());
  // app.set('trust proxy', 1);
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post('/api/save', async (req, res) => {
    // const result = await db....(req.body.id, req.body.en, req.body.ru);
    // res.json(result);
    res.json({});
  });

  app.get('/api/test', (req, res) => {
    res.json({"message": "ok"});
  });


  app.listen(port);
  console.log("Running at Port "+ port);
