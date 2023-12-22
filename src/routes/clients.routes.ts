import { Router, Request, Response } from 'express';
import * as clientController from '../controllers/user.controller';
import authToken from '../middlewares/authToken';
//import authToken from '../middlewares/authToken';

export const clientsRouter = Router();

//Connexion d'un utilisateur
clientsRouter.post('/login', clientController.login);

//Création d'un utilisateur
clientsRouter.post('/register', clientController.register);

//Modification d'un utilisateur
clientsRouter.put('/:id', authToken, clientController.updateUser);

//Suppression d'un utilisateur
clientsRouter.delete('/:id', authToken, clientController.deleteUser);

//Récupération des informations de l'utilisateur connecté
clientsRouter.get('/me', authToken, clientController.getUserConnected);

//  Refresh token
clientsRouter.post('/refreshToken', clientController.refreshToken);
export default clientsRouter;
