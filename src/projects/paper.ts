import { PaperMC, Provider } from 'src/api/minecraft/papermc';
import { Project } from '~/schema';

const paper: Project = {
	slug: 'paper',
	name: 'Paper',
};

paper.provider = new Provider(new PaperMC('https://api.papermc.io/v2'), paper);

export default paper;
