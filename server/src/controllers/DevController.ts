import { Request, Response } from 'express';

import api from '../services/api';
import Dev from '../models/Dev';

interface Data {
  name: string;
  bio: string;
  avatar_url: string;
}

export = {
  async create(request: Request, response: Response): Promise<Response> {
    const { username } = request.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return response.json(userExists);
    }

    const { data } = await api.get<Data>(`/${username}`);

    const { name, bio, avatar_url: avatar } = data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar,
      likes: [],
      dislikes: [],
      talks: [],
    });

    return response.json(dev);
  },

  async index(request: Request, response: Response): Promise<Response> {
    const { user } = request.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev?.likes } },
        { _id: { $nin: loggedDev?.dislikes } },
      ],
    });

    return response.json(users);
  },

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const dev = await Dev.findById(id);

    if (!dev) {
      throw new Error('This dev does not exists');
    }

    return response.json(dev);
  },
};
