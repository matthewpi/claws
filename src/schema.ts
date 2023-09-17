export interface Build {
	id: string;
	download: Download;
}

export interface Category {
	slug: string;
	name: string;
	projects: Project[];
}

export interface Download {
	name: string;
	url: string;
	builtAt: Date;
	size?: number;
	checksums: {
		md5?: string;
		sha1?: string;
		sha256?: string;
		sha512?: string;
	};
	metadata: Record<string, string>;
}

export interface Project {
	slug: string;
	name: string;
	versions?: string[];
	provider?: ProjectProvider;
}

export interface Version {
	name: string;
	builds: string[];
}

export interface ProjectProvider {
	getProject: () => Promise<Project | null>;
	getVersion: (version: string) => Promise<Version | null>;
	getBuild: (version: string, build: string) => Promise<Build | null>;
	getDownload: (version: string, build: string) => Promise<Response | null>;
}
