import { PaperMC } from '~/api/minecraft/papermc/index';
import { Build, EditionProvider, ProviderHandler, ProviderType, Version } from '~/schema';

export class Provider implements ProviderHandler {
	private readonly paperMC: PaperMC;
	private readonly project: EditionProvider;

	public constructor(paperMC: PaperMC, project: EditionProvider) {
		this.paperMC = paperMC;
		this.project = project;
	}

	async getProject(): Promise<EditionProvider | null> {
		const p = await this.paperMC.getProject(this.project.slug);
		if (p === null) {
			return null;
		}
		return {
			slug: this.project.slug,
			name: this.project.name,
			versions: p.versions,
			type: ProviderType.EDITION,
		};
	}

	async getVersion(version: string): Promise<Version | null> {
		const v = await this.paperMC.getVersion(this.project.slug, version);
		if (v === null) {
			return v;
		}
		return {
			name: v.version,
			builds: v.builds.map((v) => v.toString()),
		};
	}

	async getBuild(version: string, build: string): Promise<Build | null> {
		if (build === 'latest') {
			const latestBuild = await this.getVersion(version);
			if (latestBuild === null) {
				return null;
			}
			build = latestBuild.builds[0] || '';
			if (build === '') {
				return null;
			}
		}

		const b = await this.paperMC.getBuild(this.project.slug, version, build);
		if (b === null) {
			return null;
		}
		const d = b.downloads.application;
		return {
			id: build,
			download: {
				name: d.name,
				url: `/api/v1/projects/${this.project.slug}/versions/${version}/builds/${build}/download`,
				builtAt: b.time,
				checksums: {
					sha256: d.sha256,
				},
				metadata: {},
			},
		};
	}

	async getDownload(version: string, build: string): Promise<Response | null> {
		return this.paperMC.getDownload(this.project.slug, version, build);
	}
}
