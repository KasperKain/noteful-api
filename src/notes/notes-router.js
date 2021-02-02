const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const service = require('./notes-service');

const router = express.Router();
const parser = express.json();

const serialize = (note) => ({
  folder_id: note.folder_id,
  title: xss(note.title),
  body: xss(note.body),
});

router
  .route('/')
  .get(parser, async (req, res, next) => {
    const notes = await service.getNotes(req.app.get('db'));
    res.status(200).json(notes);
  })
  .post(async (req, res, next) => {
    const { title, body, folder_id } = req.body;
    const note = serialize({ title, body, folder_id });
    for (const field of ['title', 'body']) {
      if (!field || field.length < 3) {
        logger.error(`${field} must be atleast 3 characters`);
        return res.status(400).send({
          error: { message: `${field} must be atleast 3 characters` },
        });
      }
    }

    const newNote = await service.createNote(req.app.get('db'), note);
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `${note.id}`))
      .json(newNote);
  });

router
  .route('/:id')
  .all(async (req, res, next) => {
    const { id } = req.params;
    const note = await service.getNotes(req.app.get('db'), id);
    if (!note) {
      logger.error(`note with id ${id} not found`);
      return res.status(404).json({
        error: { message: 'Note not found' },
      });
    }

    res.status(201).json(note);
    next();
  })
  .get((req, res, next) => {
    res.status(200).json(serialize(res.note));
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;

      await service.deleteNote(req.app.get('db'), id);
      logger.info(`Note with id ${id} deleted`);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      next();
    }
  })
  .patch(parser, async (req, res, next) => {
    const { title, body } = req.body;
    const note = serialize({ title, body });

    const values = Object.values(note).filter(Boolean).length;
    if (values === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Missing required fields`,
        },
      });
    }

    const error = validation(note);
    if (error) return res.status(400).send(error);

    await service.updateNote(req.app.get('db'), req.params.id, note);

    res.status(204).end().catch(next);
  });

module.exports = router;
