import cachedFetch from '~/cachedFetch';
import { Build, Project, Version } from '~/schema';

const baseUrl = 'https://papermc.io/api/v2';

interface PaperProject {
	projectId: string;
	projectName: string;
	versionGroups: string[];
	versions: string[];
}

const rawDataToProject = (data: any): PaperProject => {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		versionGroups: data.version_groups,
		versions: data.versions,
	};
};

interface PaperVersion {
	projectId: string;
	projectName: string;
	version: string;
	builds: number[];
}

const rawDataToVersion = (data: any): PaperVersion => {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		version: data.version,
		builds: data.builds,
	};
};

interface PaperBuild {
	projectId: string;
	projectName: string;
	version: string;
	build: number;
	time: Date;
	changes: { commit: string; summary: string; message: string }[];
	downloads: Record<string, { name: string; sha256: string }>;
}

const rawDataToBuild = (data: any): PaperBuild => {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		version: data.version,
		build: data.build,
		time: data.time,
		changes: data.changes,
		downloads: data.downloads,
	};
};

const papermc = {
	toAPI: async (project: Project): Promise<Project | Response> => {
		const res = await cachedFetch(`${baseUrl}/projects/${project.slug}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		});
		if (res.status !== 200) {
			// TODO: Convert response to a standard error format.
			return res;
		}

		const { versions } = rawDataToProject(await res.json());
		return {
			...project,
			versions,
		};
	},

	getVersion: async (project: Project, version: string): Promise<Version | Response> => {
		const res = await cachedFetch(`${baseUrl}/projects/${project.slug}/versions/${version}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		});
		if (res.status !== 200) {
			// TODO: Convert response to a standard error format.
			return res;
		}

		const { version: name, builds } = rawDataToVersion(await res.json());

		return {
			name,
			builds: builds.sort((a, b) => a - b).map((v) => v.toString()),
		};
	},

	getBuild: async (
		project: Project,
		url: string,
		version: string,
		build: string,
	): Promise<Build | Response> => {
		if (build === 'latest') {
			const latestBuild = await papermc.getVersion(project, version);
			if (latestBuild instanceof Response) {
				return latestBuild;
			}
			build = latestBuild.builds.pop() || '';
			if (build === '') {
				return new Response('what the fuck?');
			}
		}

		const res = await cachedFetch(
			`${baseUrl}/projects/${project.slug}/versions/${version}/builds/${build}`,
			{
				headers: {
					Accept: 'application/json',
					'User-Agent': USER_AGENT,
				},
			},
		);
		if (res.status !== 200) {
			// TODO: Convert response to a standard error format.
			return res;
		}

		const { downloads, time } = rawDataToBuild(await res.json());
		const d = downloads.application;

		return {
			id: build,
			download: {
				name: d.name,
				url: `${url}/api/v1/projects/${project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: time,
				checksums: {
					sha256: d.sha256,
				},
				metadata: {},
			},
		};
	},

	getDownload: async (project: Project, version: string, build: string): Promise<Response> => {
		const jarRes = await cachedFetch(
			`${baseUrl}/projects/${project.slug}/versions/${version}/builds/${build}/downloads/${project.slug}-${version}-${build}.jar`,
			{
				headers: {
					Accept: '*/*',
					'User-Agent': USER_AGENT,
				},
			},
		);
		if (jarRes.status !== 200) {
			// TODO: Convert response to a standard error format.
			return jarRes;
		}

		const r = new Response(jarRes.body, { ...jarRes, headers: {} });
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(
				project.slug + '-' + version + '-' + build + '.jar',
			)}`,
		);
		r.headers.set('Content-Type', 'application/java-archive');
		return r;
	},
};

export default papermc;
