import paper from '~/editions/paper';
import purpur from '~/editions/purpur';
import travertine from '~/editions/travertine';
import vanilla from "~/editions/vanilla";
import waterfall from '~/editions/waterfall';
import { EditionProvider } from '~/schema';

const editions: Record<string, EditionProvider> = {
	paper,
	purpur,
	travertine,
	waterfall,
	vanilla,
};

export default editions;

export { paper, purpur, travertine, vanilla, waterfall };
