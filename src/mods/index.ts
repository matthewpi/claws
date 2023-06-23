import { EditionProvider } from '~/schema';

import curseforge from './curseforge';

const mods: Record<string, EditionProvider> = {
	curseforge,
};

export default mods;

export { curseforge };
