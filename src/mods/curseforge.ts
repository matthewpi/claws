import { Curseforge, Provider } from 'src/api/minecraft/curseforge';

import { EditionProvider, ProviderType } from '~/schema';

const curseforge: EditionProvider = {
	slug: 'curseforge',
	name: 'Curseforge',
	type: ProviderType.MOD,
};

curseforge.provider = new Provider(new Curseforge('https://api.papermc.io/v2'), curseforge);

export default curseforge;
