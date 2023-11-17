import * as repository from '../repositories/user.repository';

//  Récupération de tous les utilisateurs
export const getUsers = async () => {
	return await repository.getUsers();
};

//  Récupération d'un utilisateur par son pseudo ou email
export const getUser = async (data: string) => {
	return await repository.getUser(data);
};
