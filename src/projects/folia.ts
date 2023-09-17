import { PaperMC, Provider } from '~/api/papermc';
import { Project } from '~/schema';

const folia: Project = {
	slug: 'folia',
	name: 'Folia',
};

folia.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), folia);

export default folia;
