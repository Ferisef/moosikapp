import { Router } from 'express';
import BodyParser from 'body-parser';
import { MethodNotAllowed } from 'http-errors';
import v2 from './v2';

export default () => {
  const router = Router();

  router.use(BodyParser.json());

  router.use('/v2', v2());

  router.all('*', () => {
    throw new MethodNotAllowed('Method not allowed.');
  });

  return router;
};
