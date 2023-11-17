import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

function authToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).send('No token provide');
	}

	if (!process.env.ACCESS_TOKEN) {
		return res
			.status(401)
			.send('Missing access token. Please check your environment variables');
	}

	jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
		if (error) {
			return res.status(401).send('Unauthorized ');
		}
		req.body.user = user;
		next();
	});
}

export default authToken;
