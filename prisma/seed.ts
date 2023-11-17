import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const passwordRicky = await bcrypt.hash('Ricky', 10);
	const passwordJoan = await bcrypt.hash('Joan', 10);
	const passwordNicolas = await bcrypt.hash('Nicolas', 10);
	const passwordRomain = await bcrypt.hash('Romain', 10);

	const Ricky = await prisma.user.upsert({
		where: { email: 'ricky@gmail.com' },
		update: {},
		create: {
			username: 'Luffysonic',
			email: 'ricky@gmail.com',
			password: passwordRicky
		}
	});

	const Joan = await prisma.user.upsert({
		where: { email: 'Joan@gmail.com' },
		update: {},
		create: {
			username: 'Joan',
			email: 'Joan@gmail.com',
			password: passwordJoan
		}
	});

	const Nicolas = await prisma.user.upsert({
		where: { email: 'Nicolas@gmail.com' },
		update: {},
		create: {
			username: 'Nicolas',
			email: 'Nicolas@gmail.com',
			password: passwordNicolas
		}
	});

	const Romain = await prisma.user.upsert({
		where: { email: 'romain@gmail.com' },
		update: {},
		create: {
			username: 'Skynix',
			email: 'romain@gmail.com',
			password: passwordRomain
		}
	});

	console.log({ Ricky, Joan, Nicolas, Romain });
}

main()
	.then(async () => {
		await prisma.$disconnect;
	})
	.catch(async error => {
		console.error(error);
		await prisma.$disconnect;
		process.exit(1);
	});
