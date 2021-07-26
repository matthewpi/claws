import cachedFetch from '~/cachedFetch';
import { Build, Project, Version } from '~/schema';

const baseUrl = 'https://api.pl3x.net/v2';

interface PaperProject {
	project: string;
	versions: string[];
}

const rawDataToProject = (data: any): PaperProject => {
	return {
		project: data.project,
		versions: data.versions,
	};
};

interface PaperVersion {
	project: string;
	version: string;
	builds: {
		latest: string;
		all: string[];
	};
}

const rawDataToVersion = (data: any): PaperVersion => {
	return {
		project: data.project_id,
		version: data.version,
		builds: {
			latest: data.builds.latest,
			all: data.builds.all,
		},
	};
};

interface PaperBuild {
	project: string;
	version: string;
	build: string;
	result: string;
	duration: number;
	commits: { author: string; description: string; hash: string; email: string; timestamp: number }[];
	timestamp: Date;
	md5: string;
}

const rawDataToBuild = (data: any): PaperBuild => {
	return {
		project: data.project,
		version: data.version,
		build: data.build,
		result: data.result,
		duration: data.duration,
		commits: data.commits,
		timestamp: new Date(data.timestamp),
		md5: data.md5,
	};
};

const purpur = {
	toAPI: async (project: Project): Promise<Project> => {
		const res = await cachedFetch(`${baseUrl}/${project.slug}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		});

		const { versions } = rawDataToProject(await res.json());
		return {
			...project,
			versions,
		};
	},

	getVersion: async (project: Project, version: string): Promise<Version> => {
		const res = await cachedFetch(`${baseUrl}/${project.slug}/${version}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		});

		const { version: name, builds } = rawDataToVersion(await res.json());

		return {
			name,
			builds: builds.all,
		};
	},

	getBuild: async (project: Project, url: string, version: string, build: string): Promise<Build> => {
		const res = await cachedFetch(`${baseUrl}/${project.slug}/${version}/${build}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': USER_AGENT,
			},
		});

		const { timestamp, md5 } = rawDataToBuild(await res.json());

		return {
			id: build,
			download: {
				name: `${project.slug}-${version}-${build}.jar`,
				url: `${url}/api/v1/projects/${project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: timestamp,
				checksums: {
					md5: md5,
				},
				metadata: {},
			},
		};
	},

	getDownload: async (project: Project, version: string, build: string): Promise<Response> => {
		const jarRes = await cachedFetch(`${baseUrl}/${project.slug}/${version}/${build}/download`, {
			headers: {
				Accept: '*/*',
				'User-Agent': USER_AGENT,
			},
		});

		const r = new Response(jarRes.body, { ...jarRes, headers: {} });
		for (const h in r.headers.keys) {
			r.headers.delete(h);
		}
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(project.slug + '-' + version + '-' + build + '.jar')}`,
		);
		r.headers.set('Content-Type', 'application/java-archive');
		return r;
	},
};

export default purpur;
