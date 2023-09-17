import { PaperMC, Provider } from '~/api/papermc';
import { Project } from '~/schema';

const velocity: Project = {
	slug: 'velocity',
	name: 'Velocity',
};

velocity.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), velocity);

export default velocity;
