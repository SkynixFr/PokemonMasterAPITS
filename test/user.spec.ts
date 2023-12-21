import { expect, test, vi } from 'vitest';
import { createUser } from '../src/repositories/user.repository';
import prisma from '../libs/__mocks__/prisma';

vi.mock('../libs/prisma');

test('createUser should return the generated user', async () => {
	const newUser = {
		email: 'user@prisma.io',
		username: 'user',
		password: 'password'
	};
	prisma.user.create.mockResolvedValue({
		...newUser,
		id: '1',
		username: '',
		password: '',
		pokemons: [],
		createdAt: new Date(),
		updateAt: new Date()
	});
	const user = await createUser(
		newUser.email,
		newUser.username,
		newUser.password
	);
	expect(user.email).toStrictEqual(newUser.email);
});
