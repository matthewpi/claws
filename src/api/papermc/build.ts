export interface Build {
	projectId: string;
	projectName: string;
	version: string;
	build: number;
	time: Date;
	changes: { commit: string; summary: string; message: string }[];
	downloads: Record<string, { name: string; sha256: string }>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToBuild(data: any): Build {
	return {
		projectId: data.project_id,
		projectName: data.project_name,
		version: data.version,
		build: data.build,
		time: data.time,
		changes: data.changes,
		downloads: data.downloads,
	};
}
