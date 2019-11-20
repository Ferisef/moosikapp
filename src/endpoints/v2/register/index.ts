import { Request, Response } from 'express';
import Crypto from 'crypto';
import uuidv4 from 'uuid/v4';
import { createUser } from '../../../apis/mongodb/users';

const EMAIL_REGEX = /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;

export default () => async (req: Request, res: Response): Promise<void> => {
  if (!req.body) {
    res.status(400).send({ message: 'No body provided.' });
    return;
  }

  const { email, username, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    res.status(400).send({ message: 'Invalid e-mail address provided.' });
    return;
  }

  if (!username || /\s/.test(username)) {
    res.status(400).send({ message: 'Username must not contain spaces.' });
    return;
  }

  if (!password || /\s/.test(password)) {
    res.status(400).send({ message: 'Password must not contain spaces.' });
    return;
  }

  const salt = Crypto.randomBytes(16).toString('hex');
  const hash = Crypto.createHmac('sha512', salt).update(password).digest('hex');

  const uuid = uuidv4();

  try {
    await createUser({
      uuid, username, email, password: { hash: `${salt}.${hash}` },
    });

    res.status(201).send({ message: 'You have successfully created a new account.', uuid });
  } catch (e) {
    if (e.errmsg.startsWith('E11000')) {
      res.status(400).send({
        message: 'An account with that email address and/or username already exists.',
      });
      return;
    }

    res.status(500).send({ message: 'Internal server error.' });
  }
};
