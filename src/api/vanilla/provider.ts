import { Vanilla } from '~/api/vanilla';
import { Build, Project, ProjectProvider, Version } from '~/schema';

export class Provider implements ProjectProvider {
	private readonly vanilla: Vanilla;
	private readonly project: Project;

	public constructor(vanilla: Vanilla, project: Project) {
		this.vanilla = vanilla;
		this.project = project;
	}

	async getProject(): Promise<Project | null> {
		const p = await this.vanilla.getManifest();
		if (p === null) {
			return null;
		}
		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: p.versions.map(version => version.version),
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const v = await this.vanilla.getVersion(version);
		if (v === null) {
			return v;
		}
		return {
			name: v.version,
			builds: ["latest"],
		};
	}

	async getBuild(version: string, build: string): Promise<Build | null> {
		if (build !== 'latest') {
			return null
		}

		const b = await this.vanilla.getBuild(version);
		if (b === null) {
			return null;
		}
		const d = b.downloads.server;
		return {
			id: build,
			download: {
				name: b.name,
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: b.time,
				checksums: {
					sha1: d.sha1,
				},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, build: string): Promise<Response | null> {
		if (build !== 'latest') {
			return null
		}
		return this.vanilla.getDownload(version);
	}
}
