export interface Build {
	project: string;
	version: string;
	build: string;
	result: string;
	duration: number;
	commits: {
		author: string;
		description: string;
		hash: string;
		email: string;
		timestamp: number;
	}[];
	timestamp: Date;
	md5: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToBuild(data: any): Build {
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
}
