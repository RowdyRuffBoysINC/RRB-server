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
  let { code, word, whiteboard, } = req.body;
  Document.create({
    roomName,
    codeEditorText,
    wordEditorText,
    whiteBoardEditorValue,
  })
}));
