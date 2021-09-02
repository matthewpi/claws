export interface Category {
	slug: string;
	name: string;
	projects: Project[];
}

export interface Project {
	slug: string;
	name: string;
	versions?: string[];

	toAPI: () => Promise<Project | Response>;
	getVersion: (version: string) => Promise<Version | Response>;
	getBuild: (url: string, version: string, build: string) => Promise<Build | Response>;
	getDownload: (version: string, build: string) => Promise<Response>;
}

export interface Download {
	name: string;
	url: string;
	checksums: {
		md5?: string;
		sha1?: string;
		sha256?: string;
		sha512?: string;
	};
	builtAt: Date;
	metadata: Record<string, string>;
}

export interface Version {
	name: string;
	builds: string[];
}

export interface Build {
	id: string;
	download: Download;
}
