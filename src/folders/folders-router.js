const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const service = require('./folders-service');

const router = express.Router();
const parser = express.json();

const serialize = (folder) => ({
  name: xss(folder.name),
});

router
  .route('/')
  .get(parser, async (req, res, next) => {
    const folders = await service.getFolders(req.app.get('db'));
    res.status(200).json(folders);
  })
  .post(async (req, res, next) => {
    try {
      const { name } = req.body;
      const folder = serialize({ name });

      const note = await service.createFolder(req.app.get('db'), folder);
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${folder.id}`))
        .json(note);
    } catch (err) {
      next();
    }
  });

router
  .route('/:id')
  .all(async (req, res, next) => {
    const { id } = req.params;
    const folder = await service.getFolders(req.app.get('db'), id);

    res.status(201).json(folder);
    next();
  })
  .get((req, res, next) => {
    res.status(200).json(res.folder);
  });

module.exports = router;
