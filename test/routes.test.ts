import { test, vi, expect } from 'vitest';
import express from 'express';
import supertest from 'supertest';
import { getUser } from '../src/services/user.service'; // Assurez-vous que le chemin est correct
import clientsRouter from '../src/routes/clients.routes'; // Assurez-vous que le chemin est correct
import prisma from '../libs/__mocks__/prisma';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
vi.mock('../libs/prisma');

dotenv.config({ path: '.env.test' });
const app = express();
app.use(express.json());
app.use('/user', clientsRouter);

const passwordBcrypt = bcrypt.hashSync('password', 10);
const newUser = {
	email: 'user@prisma.io',
	id: '1',
	username: 'user',
	password: passwordBcrypt,
	pokemons: ['Pikachu'],
	createdAt: new Date(),
	updateAt: new Date()
};

const userRegisterData = {
	email: 'user@prisma.io',
	username: 'user',
	password: 'password'
};

const userLoginData = {
	email: 'user@prisma.io',
	password: 'password'
};

test('POST /user/register doit créer un utilisateur et retourner un statut 201', async () => {
	// Configurez le mock pour que prisma.user.create retourne la valeur attendue
	prisma.user.create.mockResolvedValue(newUser);

	// Configurez le mock pour que prisma.user.findFirst retourne null, indiquant que l'utilisateur n'existe pas
	prisma.user.findFirst.mockResolvedValue(null);

	// Effectuer la requête POST pour créer l'utilisateur
	const response = await supertest(app)
		.post('/user/register')
		.send(userRegisterData);

	// Assertions sur le statut de la réponse
	expect(response.status).toBe(201);

	// Configurez le mock pour que prisma.user.findFirst retourne null, indiquant que l'utilisateur n'existe pas
	prisma.user.findFirst.mockResolvedValue(newUser);
	// Récupérer l'utilisateur à partir du service
	const createdUser = await getUser(newUser.username);
	// Assurez-vous que createdUser est défini avant d'accéder à ses propriétés
	expect(createdUser).toBeDefined();
	expect(createdUser!.email).toBe(newUser.email);
	expect(createdUser!.username).toBe(newUser.username);
});

test('POST /user/register doit créer un utilisateur et retourner un statut 400', async () => {
	const userRegisterData = {
		email: '',
		username: 'user',
		password: 'password'
	};
	// Configurez le mock pour que prisma.user.findFirst retourne null, indiquant que l'utilisateur n'existe pas
	prisma.user.findFirst.mockResolvedValue(null);
	// Effectuer la requête POST pour créer l'utilisateur
	const response = await supertest(app)
		.post('/user/register')
		.send(userRegisterData);
	// Assertions sur le statut de la réponse
	expect(response.status).toBe(400);
	// Récupérer l'utilisateur à partir du service
	const createdUser = await getUser(newUser.username);
	expect(createdUser).toBeNull();
});

test('POST /user/login doit retourner un statut 200', async () => {
	// Configurez le mock pour que prisma.user.findFirst retourne l'utilisateur créé
	prisma.user.findFirst.mockResolvedValue(newUser);
	const response = await supertest(app)
		.post('/user/login')
		.send(userLoginData);

	// Assertions sur le statut de la réponse
	expect(response.status).toBe(200);
	expect(response.body.accessToken).toBeDefined();
	expect(response.body.refreshToken).toBeDefined();
});

test('POST /user/login doit retourner un statut 401', async () => {
	// Configurez le mock pour que prisma.user.findFirst retourne l'utilisateur créé
	prisma.user.findFirst.mockResolvedValue(newUser);
	const userLoginData = {
		email: 'user@prisma.io',
		password: 'password2'
	};
	const response = await supertest(app)
		.post('/user/login')
		.send(userLoginData);

	// Assertions sur le statut de la réponse
	expect(response.status).toBe(401);
	expect(response.body.accessToken).toBeUndefined();
	expect(response.body.refreshToken).toBeUndefined();
});
