import folia from '~/projects/folia';
import paper from '~/projects/paper';
import purpur from '~/projects/purpur';
import travertine from '~/projects/travertine';
import vanilla from '~/projects/vanilla';
import waterfall from '~/projects/waterfall';
import type { Project } from '~/schema';

const projects: Record<string, Project> = {
	folia,
	paper,
	purpur,
	travertine,
	vanilla,
	waterfall,
};

export default projects;

export { folia, paper, purpur, travertine, vanilla, waterfall };
