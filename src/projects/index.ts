import paper from '~/projects/paper';
import purpur from '~/projects/purpur';
import travertine from '~/projects/travertine';
import waterfall from '~/projects/waterfall';
import { Project } from '~/schema';

const projects: Record<string, Project> = {
	paper,
	purpur,
	travertine,
	waterfall,
};

export default projects;

export { paper, purpur, travertine, waterfall };
