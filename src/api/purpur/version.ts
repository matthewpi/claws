import comparator from '~/comparator';

export interface Version {
	project: string;
	version: string;
	builds: {
		latest: string;
		all: string[];
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToVersion(data: any): Version {
	return {
		project: data.project_id,
		version: data.version,
		builds: {
			latest: data.builds.latest,
			all: data.builds.all.sort(comparator).reverse(),
		},
	};
}
