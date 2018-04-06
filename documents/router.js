import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

import { Document, } from './models';

export const router = express.Router();

mongoose.Promise = global.Promise;

router.use(bodyParser.json());

router.get('/', asyncHandler(async (req, res, next) => {
  const documents = await Document.find();
  res.json(documents)
}));

router.get('/:roomName', asyncHandler(async (req, res, next) => {
  const documents = await Document.find({roomName: req.params.roomName});
  res.json(documents);
}));

router.post('/', asyncHandler(async (req, res, next) => {
  const document = await Document.create(req.body);
  res.status(201).json(document.serialize());
}));

router.put('/:roomName', asyncHandler(async (req, res, next) => {
  Document
    .update({roomName: req.params.roomName}, req.body)
    .then(() => {
      res.send();
    })
    .catch(err => console.error(err))
}))
