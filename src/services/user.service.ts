import * as repository from '../repositories/user.repository';

//  Récupération de tous les utilisateurs
export const getUsers = async () => {
	return await repository.getUsers();
};

//  Récupération d'un utilisateur par son pseudo ou email
export const getUser = async (data: string) => {
	return await repository.getUser(data);
};

//  Création d'un utilisateur
export const createUser = async (
	username: string,
	email: string,
	password: string
) => {
	return await repository.createUser(username, email, password);
};
//  Recherche d'un utilisateur par son pseudo ou email
export const checkIfUserExistByUsernameOrEmail = async (
	username: string,
	email: string
) => {
	const user = await repository.findUserByUsernameOrEmail(username, email);
	return user !== null;
};

//  Recherche d'un utilisateur par son id
export const checkIfUserExistById = async (id: string) => {
	const user = await repository.findUserById(id);
	return user !== null;
};

//  Modification d'un utilisateur
export const updateUser = async (id: string, data: string) => {
	return await repository.updateUser(id, data);
};

//  Suppression d'un utilisateur
export const deleteUser = async (id: string) => {
	return await repository.deleteUser(id);
};
