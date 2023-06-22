import { Curseforge, Provider } from 'src/api/minecraft/curseforge';

import { ProjectProvider } from '~/schema';

const curseforge: ProjectProvider = {
	slug: 'curseforge',
	name: 'CurseForge',
};

curseforge.provider = new Provider(new Curseforge('https://api.papermc.io/v2'), curseforge);

export default curseforge;
