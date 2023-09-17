import { StatusError } from 'itty-router-extras';

import { Provider } from '~/api/mojang/provider';
import cachedFetch from '~/cachedFetch';

interface Version {
	id: string;
	type: 'release' | string;
	url: string;
	time: string;
	releaseTime: string;
	sha1: string;
	complianceLevel: number;
}

interface VersionManifest {
	versions: Version[];
}

interface Download {
	sha1: string;
	size: number;
	url: string;
}

interface VersionURL {
	downloads: {
		client: Download;
		client_mappings: Download;
		server: Download;
		server_mappings: Download;
	};
}

class Mojang {
	private readonly versionManifest: string;

	constructor() {
		this.versionManifest = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
	}

	/**
	 * ?
	 * @returns ?
	 */
	async getManifest(): Promise<VersionManifest | null> {
		const res = await this.cachedFetch(this.versionManifest);
		if (res === null) {
			return null;
		}

		return await res.json();
	}

	/**
	 * ?
	 * @returns ?
	 */
	async getVersion(version: string): Promise<{ version: Version; data: VersionURL; } | null> {
		const manifest = await this.getManifest();
		if (manifest === null) {
			return null;
		}

		const manifestVersion = manifest.versions.filter(v => v.type === 'release').find(v => v.id === version);
		if (manifestVersion === undefined) {
			return null;
		}

		const res = await this.cachedFetch(manifestVersion.url);
		if (res === null) {
			return null;
		}

		return {
			version: manifestVersion,
			data: await res.json(),
		};
	}

	/**
	 * ?
	 * @param project ?
	 * @param version ?
	 * @param build ?
	 * @returns ?
	 */
	async getDownload(version: string): Promise<Response | null> {
		const v = await this.getVersion(version);
		if (v === null) {
			return null;
		}

		const res = await this.fetch(
			v.data.downloads.server.url,
			{
				cf: {
					cacheEverything: true,
					cacheTtl: 24 * 60 * 60,
				},
				headers: {
					Accept: 'application/java-archive, application/json',
				},
			},
		);
		if (res === null) {
			return null;
		}

		const r = new Response(res.body, { ...res, headers: {} });
		r.headers.set(
			'Content-Disposition',
			`attachment; filename=${JSON.stringify(`minecraft-${version}.jar`)}`,
		);
		r.headers.set('Content-Type', 'application/java-archive');
		return r;
	}

	/**
	 * ?
	 * @param input ?
	 * @param init ?
	 * @returns ?
	 */
	private async cachedFetch(input: string, init?: RequestInit): Promise<Response | null> {
		const res = await cachedFetch(input, init);
		switch (res.status) {
			case 200:
				break;
			case 404:
				return null;
			default:
				throw new StatusError(res.status, '');
		}
		return res;
	}

	/**
	 * ?
	 * @param input ?
	 * @param init ?
	 * @returns ?
	 */
	private async fetch(input: string, init?: RequestInit): Promise<Response | null> {
		const options = init || {};
		options.headers = {
			...options.headers,
			'User-Agent': 'Claws',
		};
		const res = await fetch(input, options);
		switch (res.status) {
			case 200:
				break;
			case 404:
				return null;
			default:
				throw new StatusError(res.status, '');
		}
		return res;
	}
}

export { Mojang, Provider };
