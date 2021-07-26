import papermc from '~/api/papermc';
import { Build, Project, Version } from '~/schema';

const waterfall: Project = {
	slug: 'waterfall',
	name: 'Waterfall',

	toAPI: async (): Promise<Project> => papermc.toAPI(waterfall),
	getVersion: async (version: string): Promise<Version> => papermc.getVersion(waterfall, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build> =>
		papermc.getBuild(waterfall, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> => papermc.getDownload(waterfall, version, build),
};

export default waterfall;
