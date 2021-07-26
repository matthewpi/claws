import papermc from '~/api/papermc';
import { Build, Project, Version } from '~/schema';

const paper: Project = {
	slug: 'paper',
	name: 'Paper',

	toAPI: async (): Promise<Project> => papermc.toAPI(paper),
	getVersion: async (version: string): Promise<Version> => papermc.getVersion(paper, version),
	getBuild: async (url: string, version: string, build: string): Promise<Build> =>
		papermc.getBuild(paper, url, version, build),
	getDownload: (version: string, build: string): Promise<Response> => papermc.getDownload(paper, version, build),
};

export default paper;
