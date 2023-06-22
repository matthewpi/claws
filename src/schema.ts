export interface Build {
	id: string;
	download: Download;
}

export interface Category {
	slug: string;
	name: string;
	projectProviders: ProjectProvider[];
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

// Base for all providers
// i.e. PaperMC, Vanilla, etc.
// i.e. CurseForge, Technic, etc.
export interface Provider {
	slug: string;
	name: string;
	provider?: ProviderHandler;
}

// Base for all project providers
// i.e. Paper, Vanilla, etc.
export interface ProjectProvider extends Provider {
	versions?: string[];
}

// Base for all mod/modpack provider
// i.e. Curseforge, Technic, etc.
export interface ModProvider extends Provider {
	// TODO: Add any other fields
}

export interface Version {
	name: string;
	builds: string[];
}

export interface ProviderHandler {
	getProject: () => Promise<ProjectProvider | null>;
	getVersion: (version: string) => Promise<Version | null>;
	getBuild: (version: string, build: string) => Promise<Build | null>;
	getDownload: (version: string, build: string) => Promise<Response | null>;
}
