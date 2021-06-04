import development from './development.config';
import production from './production.config';
const env = 'production';

const config = {
	development,
	production,
};

export default config[env];
