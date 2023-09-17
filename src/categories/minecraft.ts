import { folia, paper, purpur, travertine, vanilla, velocity, waterfall } from '~/projects';
import { Category } from '~/schema';

const minecraft: Category = {
	slug: 'minecraft',
	name: 'Minecraft',
	projects: [
		{
			slug: folia.slug,
			name: folia.name,
		},
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
			slug: vanilla.slug,
			name: vanilla.name,
		},
		{
			slug: velocity.slug,
			name: velocity.name,
		},
		{
			slug: waterfall.slug,
			name: waterfall.name,
		},
	],
};

export default minecraft;
