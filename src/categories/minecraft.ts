import { paper, purpur, travertine, vanilla, waterfall } from 'src/editions';

import { curseforge } from '~/mods';
import { Category } from '~/schema';

const minecraft: Category = {
	slug: 'minecraft',
	name: 'Minecraft',
	editionProviders: [
		{
			slug: paper.slug,
			name: paper.name,
		},
		{
			slug: purpur.slug,
			name: purpur.name,
		},
		{
			slug: travertine.slug,
			name: travertine.name,
		},
		{
			slug: waterfall.slug,
			name: waterfall.name,
		},
		{
			slug: vanilla.slug,
			name: vanilla.name,
		},
	],
	modProviders: [
		{
			slug: curseforge.slug,
			name: curseforge.name,
		},
	],
};

export default minecraft;
