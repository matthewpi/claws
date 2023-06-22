import { PaperMC, Provider } from 'src/api/minecraft/papermc';
import { ProjectProvider } from '~/schema';

const paper: ProjectProvider = {
	slug: 'paper',
	name: 'Paper',
};

paper.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), paper);

export default paper;
