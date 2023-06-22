import { Provider, Purpur } from 'src/api/minecraft/purpur';
import { ProjectProvider } from '~/schema';

const purpur: ProjectProvider = {
	slug: 'purpur',
	name: 'Purpur',
};

purpur.provider = new Provider(new Purpur('https://api.purpurmc.org/v2'), purpur);

export default purpur;
