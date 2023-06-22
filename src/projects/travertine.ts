import { PaperMC, Provider } from 'src/api/minecraft/papermc';
import { ProjectProvider } from '~/schema';

const travertine: ProjectProvider = {
	slug: 'travertine',
	name: 'Travertine',
};

travertine.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), travertine);

export default travertine;
