import type { Mojang } from '~/api/mojang';
import { Build, Project, ProjectProvider, Version } from '~/schema';

export class Provider implements ProjectProvider {
	private readonly mojang: Mojang;
	private readonly project: Project;

	public constructor(mojang: Mojang, project: Project) {
		this.mojang = mojang;
		this.project = project;
	}

	async getProject(): Promise<Project | null> {
		const manifest = await this.mojang.getManifest();
		if (manifest === null) {
			return null;
		}

		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: manifest.versions.filter(v => v.type === 'release').map(v => v.id),
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const manifest = await this.mojang.getManifest();
		if (manifest === null) {
			return null;
		}

		const manifestVersion = manifest.versions.filter(v => v.type === 'release').find(v => v.id === version);
		if (manifestVersion === undefined) {
			return null;
		}

		return {
			name: manifestVersion.id,
			builds: ['latest'],
		};
	}

	async getBuild(version: string, _: string): Promise<Build | null> {
		const data = await this.mojang.getVersion(version);
		if (data === null) {
			return null;
		}

		return {
			id: 'latest',
			download: {
				name: 'server.jar',
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/latest/download`,
				builtAt: new Date(data.version.releaseTime),
				size: data.data.downloads.server.size,
				checksums: {
					sha1: data.data.downloads.server.sha1,
				},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, _: string): Promise<Response | null> {
		return this.mojang.getDownload(version);
	}
}
