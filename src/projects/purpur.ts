import { Provider, Purpur } from '~/api/purpur';
import { Project } from '~/schema';

const purpur: Project = {
	slug: 'purpur',
	name: 'Purpur',
};

purpur.provider = new Provider(new Purpur('https://api.pl3x.net/v2'), purpur);

export default purpur;
