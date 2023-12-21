import { Router, Request, Response } from 'express';
import * as clientController from '../controllers/user.controller';
//import authToken from '../middlewares/authToken';

const clientsRouter = Router();

//Connexion d'un utilisateur
clientsRouter.post('/login', clientController.login);

//Création d'un utilisateur
clientsRouter.post('/register', clientController.register);
export default clientsRouter;
