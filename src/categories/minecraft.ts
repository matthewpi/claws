import { paper, purpur, travertine, waterfall, vanilla } from '~/projects';
import { Category } from '~/schema';

const minecraft: Category = {
	slug: 'minecraft',
	name: 'Minecraft',
	projects: [
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
};

export default minecraft;
