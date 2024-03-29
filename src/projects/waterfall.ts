import { PaperMC, Provider } from '~/api/papermc';
import { Project } from '~/schema';

const waterfall: Project = {
	slug: 'waterfall',
	name: 'Waterfall',
};

waterfall.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), waterfall);

export default waterfall;
