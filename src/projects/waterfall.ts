import { PaperMC, Provider } from 'src/api/minecraft/papermc';
import { ProjectProvider } from '~/schema';

const waterfall: ProjectProvider = {
	slug: 'waterfall',
	name: 'Waterfall',
};

waterfall.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), waterfall);

export default waterfall;
