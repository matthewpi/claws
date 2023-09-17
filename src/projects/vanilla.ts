import { Mojang, Provider } from '~/api/mojang';
import { Project } from '~/schema';

const vanilla: Project = {
	slug: 'vanilla',
	name: 'Vanilla',
};

vanilla.provider = new Provider(new Mojang(), vanilla);

export default vanilla;
