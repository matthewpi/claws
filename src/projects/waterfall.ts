import papermc from '~/api/papermc';
import { Build, Project, Version } from '~/schema';

const waterfall: Project = {
	slug: 'waterfall',
	name: 'Waterfall',

	toAPI: async (): Promise<Project | Response> => papermc.toAPI(waterfall),
	getVersion: async (version: string): Promise<Version | Response> =>
		papermc.getVersion(waterfall, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build | Response> =>
		papermc.getBuild(waterfall, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> =>
		papermc.getDownload(waterfall, version, build),
};

export default waterfall;
