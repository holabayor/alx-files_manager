import { existsSync, mkdir, writeFileSync } from 'fs';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    console.log(key);
    const userId = await redisClient.get(key);
    console.log(userId);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) {
      res.status(400).send({ error: 'Missing name' });
      return;
    }
    const acceptedTypes = ['folder', 'file', 'image'];
    if (!type && !acceptedTypes.includes(type)) {
      res.status(400).send({ error: 'Missing data' });
      return;
    }

    if (!data && type !== 'folder') {
      res.status(400).send({ error: 'Missing data' });
      return;
    }

    console.log(parentId !== 0);
    if (parentId) {
      const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });
      if (!file) {
        res.status(400).send({ error: 'Parent not found' });
        return;
      }
      if (file.type !== 'folder') {
        res.status(400).send({ error: 'Parent is not a folder' });
        return;
      }
    }
    const newFile = {
      userId: user._id, name, type, isPublic, parentId,
    };
    if (type === 'folder') {
      const file = await dbClient.db.collection('files').insertOne(newFile);
      newFile.id = file.insertedId;
      delete newFile._id;
      res.status(201).send(newFile);
    } else {
      const localPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filename = uuidv4();
      const filePath = path.join(localPath, filename);
      if (!existsSync(localPath)) {
        await mkdir(localPath, { recursive: true }, (err) => {
          if (err) console.log('Not created');
        });
      }
      const decodedData = Buffer.from(data, 'base64');
      writeFileSync(filePath, decodedData, 'utf8');
      newFile.localPath = filePath;
      await dbClient.db.collection('files').insertOne(newFile);
      newFile.id = newFile._id;
      delete newFile._id;
      delete newFile.localPath;
      res.status(201).send(newFile);
    }
  }

  static async getShow(req, res) {
    const { id } = req.params;
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    console.log(key);
    const userId = await redisClient.get(key);
    console.log(userId);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });

    const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(id), userId: user._id });
    if (!file) {
      res.status(404).send({ error: 'Not found' });
      return;
    }
    file.id = file._id;
    delete file._id;
    delete file.localPath;
    res.status(200).send(file);
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    /* const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });

    const file = await dbClient.db.collection('files').find({ parentId });
    if (!file) {
      res.status(404).send({ error: 'Not found' });
      return;
    } */
    res.status(200).send({});
  }
}

export default FilesController;