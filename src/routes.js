import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Middleware definido de forma global. Afeta tudo que vem a seguir.

//routes.put('/users', authMiddleware, UserController.update); // Middleware local. Afeta apenas esta rota.
routes.put('/users', UserController.update);

export default routes;