import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';

dotenv.config();

if (!process.env.EXPRESS_PORT) {
	console.log('Missing Express port');
	process.exit(1);
}

const limiter = rateLimit({
	max: 20,
	windowMs: 1000 * 60,
	message: 'Too many request from this IP'
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use('/api/v1/', routes);

try {
	app.listen(process.env.EXPRESS_PORT, () => {
		console.log(
			`Server is running on http://localhost:${process.env.EXPRESS_PORT}`
		);
	});
} catch (error) {
	console.error(error);
}
