import { PaperMC, Provider } from '~/api/papermc';
import { Project } from '~/schema';

const travertine: Project = {
	slug: 'travertine',
	name: 'Travertine',
};

travertine.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), travertine);

export default travertine;
