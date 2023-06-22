import { ProjectProvider } from '~/schema';

import curseforge from './curseforge';

const mods: Record<string, ProjectProvider> = {
	curseforge,
};

export default mods;

export { curseforge };
