import { Provider, Purpur } from '~/api/purpur';
import { Project } from '~/schema';

const purpur: Project = {
	slug: 'purpur',
	name: 'Purpur',
};

purpur.provider = new Provider(new Purpur('https://api.purpurmc.org/v2'), purpur);

export default purpur;
