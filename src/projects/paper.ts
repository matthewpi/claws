import papermc from '~/api/papermc';
import { Build, Project, Version } from '~/schema';

const paper: Project = {
	slug: 'paper',
	name: 'Paper',

	toAPI: async (): Promise<Project | Response> => papermc.toAPI(paper),
	getVersion: async (version: string): Promise<Version | Response> =>
		papermc.getVersion(paper, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build | Response> =>
		papermc.getBuild(paper, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> =>
		papermc.getDownload(paper, version, build),
};

export default paper;
