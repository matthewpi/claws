import { Vanilla, Provider } from 'src/api/minecraft/vanilla';
import { Project } from '~/schema';

const vanilla: Project = {
	slug: 'vanilla',
	name: 'Vanilla',
};

vanilla.provider = new Provider(
	new Vanilla('https://launchermeta.mojang.com/mc/game/version_manifest.json'), vanilla
);

export default vanilla;
