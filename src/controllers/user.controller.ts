import * as service from '../services/user.service';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

//  Récupération de tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await service.getUsers();
		return res.status(200).send(users);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error while fetching users');
	}
};

//  Récupération d'un utilisateur par son pseudo ou email
export const getUser = async (req: Request, res: Response) => {
	try {
		const data = req.params.user;
		const user = await service.getUser(data);

		if (!user) {
			return res.status(404).send('User not found');
		}

		return res.status(200).send(user);
	} catch (error) {
		return res.status(500).send('Error while fetching the user');
	}
};

//	Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
	// Récupérer la première propriété de req.body
	const dataKey = Object.keys(req.body)[0];
	const data = req.body[dataKey];
	const passwordKey = Object.keys(req.body)[1];
	const password = req.body[passwordKey];
	const user = await service.getUser(data);

	if (!user) {
		return res.status(404).send('User not found');
	}

	try {
		//  Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);

		// if (!isPasswordValid) {
		// 	return res.status(401).send('Invalid password');
		// }

		if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
			return res
				.status(401)
				.send('Missing token. Please check your environment variables');
		}

		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
			expiresIn: '600s'
		});

		const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN, {
			expiresIn: '86400s'
		});

		return res.status(200).send({
			accessToken: accessToken,
			refreshToken: refreshToken
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error while login the user');
	}
};
