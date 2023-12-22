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

		if (!isPasswordValid) {
			return res.status(401).send('Invalid password');
		}

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

//  Création d'un utilisateur
export const register = async (req: Request, res: Response) => {
	const { email, username, password } = req.body;
	if (!email || !username || !password) {
		return res
			.status(400)
			.send(
				'Missing required data. Please provide email, username, and password.'
			);
	}

	const userPassword = await bcrypt.hash(password, 10);

	const userExist = await service.checkIfUserExistByUsernameOrEmail(
		username,
		email
	);

	if (userExist) {
		return res.status(400).send('User already exist');
	}

	try {
		const newUser = await service.createUser(username, email, userPassword);
		return res.status(201).send(newUser);
	} catch (error) {
		return res.status(500).send('Error while creating the user');
	}
};

//  Modification d'un utilisateur
export const updateUser = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const { user, ...data } = req.body;

	//  Vérification des données en entrée
	if (JSON.stringify(data) === '{}') {
		return res
			.status(400)
			.send(
				'Missing required data. Please provide email, username, or password.'
			);
	}
	//  Vérification de l'existence de l'utilisateur
	const userExist = await service.checkIfUserExistById(userId);

	if (!userExist) {
		return res.status(404).send('User not found');
	}

	if (data.email || data.username) {
		const userBddExist = await service.checkIfUserExistByUsernameOrEmail(
			data.username,
			data.email
		);

		if (userBddExist) {
			return res.status(409).send('User already exist');
		}
	}

	try {
		const updatedUser = await service.updateUser(userId, data);
		return res.status(200).send(updatedUser);
	} catch (error) {
		return res.status(500).send('Error while updating the user');
	}
};

//	Suppression d'un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
	const userId = req.params.id;

	const userExist = await service.checkIfUserExistById(userId);

	if (!userExist) {
		return res.status(404).send('User not found');
	}

	try {
		await service.deleteUser(userId);
		return res.status(200).send('User deleted');
	} catch (error) {
		console.error(error);
		return res.status(500).send('Error while deleting the user');
	}
};
