import prisma from '../../libs/prisma';

//  Récupération de tous les utilisateurs
export const getUsers = async () => {
	return await prisma.user.findMany();
};

//  Récupération d'un utilisateur par son pseudo ou email
export const getUser = async (data: string) => {
	return await prisma.user.findFirst({
		where: {
			OR: [
				{
					email: { equals: data, mode: 'insensitive' }
				},
				{
					username: { equals: data, mode: 'insensitive' }
				}
			]
		}
	});
};

//  Création d'un utilisateur
export const createUser = async (
	username: string,
	email: string,
	password: string
) => {
	return await prisma.user.create({
		data: {
			username,
			email,
			password
		}
	});
};

//  Modification d'un utilisateur
export const updateUser = async (id: string, data: string) => {
	return await prisma.user.update({
		where: {
			id: id
		},
		data: data
	});
};

//  Suppression d'un utilisateur
export const deleteUser = async (id: string) => {
	await prisma.user.delete({
		where: {
			id: id
		}
	});
};

//  Recherche d'un utilisateur par son pseudo ou email
export const findUserByUsernameOrEmail = async (
	username: string,
	email: string
) => {
	return await prisma.user.findFirst({
		where: {
			OR: [
				{ username: { equals: username, mode: 'insensitive' } },
				{ email: { equals: email, mode: 'insensitive' } }
			]
		}
	});
};

//  Recherche d'un utilisateur par son id
export const findUserById = async (id: string) => {
	return await prisma.user.findUnique({
		where: {
			id: id
		}
	});
};

//  Ajout de pokémons au pokédex de l'utilisateur
export const addPokemons = async (id: string, pokemons: string[]) => {
	return prisma.user.update({
		where: { id: id },
		data: {
			pokemons: { set: pokemons }
		}
	});
};
