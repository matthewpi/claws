import paper from '~/projects/paper';
import purpur from '~/projects/purpur';
import travertine from '~/projects/travertine';
import waterfall from '~/projects/waterfall';
import vanilla from "~/projects/vanilla";
import { Project } from '~/schema';

const projects: Record<string, Project> = {
	paper,
	purpur,
	travertine,
	waterfall,
	vanilla,
};

export default projects;

export { paper, purpur, travertine, waterfall, vanilla };
