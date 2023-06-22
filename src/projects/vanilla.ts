import { Vanilla, Provider } from 'src/api/minecraft/vanilla';
import { ProjectProvider } from '~/schema';

const vanilla: ProjectProvider = {
	slug: 'vanilla',
	name: 'Vanilla',
};

vanilla.provider = new Provider(
	new Vanilla('https://launchermeta.mojang.com/mc/game/version_manifest.json'), vanilla
);

export default vanilla;
