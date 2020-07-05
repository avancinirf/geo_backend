import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

// TODO - Passar as rotas de get para controle de sessão...
routes.get('/users/:_id', UserController.get);
routes.get('/users', UserController.getActive);
routes.get('/users_all', UserController.getAll); // TODO - Colocar depois do middleware de autenticação e verificar se é admin
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Middleware definido de forma global. Afeta tudo que vem a seguir.

//routes.put('/users', authMiddleware, UserController.update); // Middleware local. Afeta apenas esta rota.
routes.put('/users', UserController.update);
routes.delete('/users/:_id', UserController.delete);

routes.post('/files_img', upload.single('file'), FileController.store_img);
//routes.post('/files_kml', uploadKml.single('file'), FileController.store_kml);

export default routes;