import comparator from '~/comparator';

export interface Project {
	project: string;
	versions: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function rawDataToProject(data: any): Project {
	return {
		project: data.project,
		versions: data.versions.sort(comparator).reverse(),
	};
}
