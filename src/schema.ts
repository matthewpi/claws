export interface Build {
	id: string;
	download: Download;
}

export interface Category {
	slug: string;
	name: string;
	editionProviders: EditionProvider[];
	modProviders: ModProvider[];
}

export interface Download {
	name: string;
	url: string;
	builtAt: Date;
	checksums: {
		md5?: string;
		sha1?: string;
		sha256?: string;
		sha512?: string;
	};
	metadata: Record<string, string>;
}

export enum ProviderType {
	EDITION= 'edition',
	MOD = 'mod',
}

// Base for all providers
// i.e. PaperMC, Vanilla, etc.
// i.e. CurseForge, Technic, etc.
export interface Provider {
	slug: string;
	name: string;
	provider?: ProviderHandler;
	type: ProviderType;
}


// Base for all edition providers
// i.e. Paper, Vanilla, etc.
export interface EditionProvider extends Provider {
	versions?: string[];
}

// Base for all mod/modpack provider
// i.e. Curseforge, Technic, etc.
export type ModProvider = Provider

export interface Version {
	name: string;
	builds: string[];
}

export interface ProviderHandler {
	getProject: () => Promise<Provider | null>;
	getVersion: (version: string) => Promise<Version | null>;
	getBuild: (version: string, build: string) => Promise<Build | null>;
	getDownload: (version: string, build: string) => Promise<Response | null>;
}
