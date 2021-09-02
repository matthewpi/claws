import papermc from '~/api/papermc';
import { Build, Project, Version } from '~/schema';

const travertine: Project = {
	slug: 'travertine',
	name: 'Travertine',

	toAPI: async (): Promise<Project | Response> => papermc.toAPI(travertine),
	getVersion: async (version: string): Promise<Version | Response> =>
		papermc.getVersion(travertine, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build | Response> =>
		papermc.getBuild(travertine, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> =>
		papermc.getDownload(travertine, version, build),
};

export default travertine;
