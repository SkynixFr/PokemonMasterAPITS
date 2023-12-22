import { expect, test, vi } from 'vitest';
import {
	createUser,
	getUser,
	getUsers,
	updateUser
} from '../src/repositories/user.repository';
import prisma from '../libs/__mocks__/prisma';

vi.mock('../libs/prisma');

test("createUser doit retourner l'utilisateur crée", async () => {
	const newUser = {
		email: 'user@prisma.io',
		id: '1',
		username: 'user',
		password: 'password',
		pokemons: ['Pikachu'],
		createdAt: new Date(),
		updateAt: new Date()
	};
	prisma.user.create.mockResolvedValue({
		...newUser
	});
	const user = await createUser(
		newUser.email,
		newUser.username,
		newUser.password
	);
	expect(user).toStrictEqual(newUser);
});

test("GetUser doit retourner l'utilisateur recherché", async () => {
	const existingUser = {
		email: 'user@prisma.io',
		id: '2',
		username: 'user',
		password: 'password',
		pokemons: ['Pikachu'],
		createdAt: new Date(),
		updateAt: new Date()
	};
	prisma.user.findFirst.mockResolvedValue(existingUser); // Utilisez findFirst au lieu de findUnique
	const user = await getUser(existingUser.email);
	expect(user).toStrictEqual(existingUser);
});

test("GetUser doit retourner null si l'utilisateur n'existe pas", async () => {
	prisma.user.findFirst.mockResolvedValue(null);
	const user = await getUser('user');
	expect(user).toBeNull();
});

test('GetUsers doit retourner la liste des utilisateurs', async () => {
	const existingUsers = [
		{
			email: 'user@prisma.io',
			id: '1',
			username: 'user',
			password: 'password',
			pokemons: ['Pikachu'],
			createdAt: new Date(),
			updateAt: new Date()
		},
		{
			email: 'user2@prisma.io',
			id: '2',
			username: 'user2',
			password: 'password2',
			pokemons: ['Pikachu'],
			createdAt: new Date(),
			updateAt: new Date()
		}
	];
	prisma.user.findMany.mockResolvedValue(existingUsers);
	const users = await getUsers();
	expect(users).toStrictEqual(existingUsers);
});

test("GetUsers doit retourner une liste vide si aucun utilisateur n'existe", async () => {
	prisma.user.findMany.mockResolvedValue([]);
	const users = await getUsers();
	expect(users).toStrictEqual([]);
});

test("updateUser doit retourner l'utilisateur modifié", async () => {
	const existingUser = {
		email: 'user@prisma.io',
		id: '1',
		username: 'user2',
		password: 'password',
		pokemons: ['Pikachu'],
		createdAt: new Date(),
		updateAt: new Date()
	};
	prisma.user.update.mockResolvedValue(existingUser);
	const user = await updateUser(existingUser.id, existingUser.username);
	expect(user).toStrictEqual(existingUser);
});
