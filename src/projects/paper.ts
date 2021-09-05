import { PaperMC, Provider } from '~/api/papermc';
import { Project } from '~/schema';

const paper: Project = {
	slug: 'paper',
	name: 'Paper',
};

paper.provider = new Provider(new PaperMC('https://papermc.io/api/v2'), paper);

export default paper;
