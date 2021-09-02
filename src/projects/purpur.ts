import purpurApi from '~/api/purpur';
import { Build, Project, Version } from '~/schema';

const purpur: Project = {
	slug: 'purpur',
	name: 'Purpur',

	toAPI: async (): Promise<Project | Response> => purpurApi.toAPI(purpur),
	getVersion: async (version: string): Promise<Version | Response> =>
		purpurApi.getVersion(purpur, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build | Response> =>
		purpurApi.getBuild(purpur, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> =>
		purpurApi.getDownload(purpur, version, build),
};

export default purpur;
