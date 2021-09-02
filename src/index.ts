import { json as ittyJson, missing, ThrowableRouter, withParams } from 'itty-router-extras';

import categories from '~/categories';
import projects from '~/projects';

const router = ThrowableRouter();

const getURL = (url: string) => {
	const u = new URL(url);
	return u.protocol + '//' + u.host;
};

const json = (v: any): Response => {
	const r: Response = ittyJson(v);
	r.headers.set('Access-Control-Allow-Origin', '*');
	r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	r.headers.set('Cache-Control', 'no-store');
	r.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
	r.headers.set('X-Frame-Options', 'DENY');
	return r;
};

router.options('*', (req: Request) => {
	const origin = req.headers.get('Origin');
	const r = new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': origin || '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
		},
	});
	r.headers.append('Vary', 'Origin');
	return r;
});

router.get('/', () => new Response('Hello, world!'));

router.get('/api/v1/categories', () => {
	const data = [];
	for (const k in categories) {
		data.push(categories[k]);
	}
	return json(data);
});

router.get('/api/v1/categories/:category', withParams, ({ category }: { category: string }) => {
	if (!(category in categories)) {
		return missing('category not found');
	}

	return json(categories[category]);
});

router.get(
	'/api/v1/categories/:category/projects',
	withParams,
	({ category }: { category: string }) => {
		if (!(category in categories)) {
			return missing('category not found');
		}

		return json(categories[category].projects);
	},
);

router.get('/api/v1/projects', () => {
	const data = [];
	for (const k in projects) {
		data.push(projects[k]);
	}
	return json(data);
});

router.get('/api/v1/projects/:project', withParams, async ({ project }: { project: string }) => {
	if (!(project in projects)) {
		return missing('project not found');
	}

	return json(await projects[project]?.toAPI());
});

router.get(
	'/api/v1/projects/:project/versions',
	withParams,
	async ({ project }: { project: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}

		const res = await projects[project]?.toAPI();
		if (res instanceof Response) {
			return res;
		}
		return json(res.versions);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version',
	withParams,
	async ({ project, version }: { project: string; version: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}

		return json(await projects[project]?.getVersion(version));
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds',
	withParams,
	async ({ project, version }: { project: string; version: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}

		const res = await projects[project]?.getVersion(version);
		if (res instanceof Response) {
			return res;
		}
		return json(res.builds);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds/:build',
	async ({
		params,
		url,
	}: {
		params: { project: string; version: string; build: string };
		url: string;
	}) => {
		if (!(params.project in projects)) {
			return missing('project not found');
		}

		return json(
			await projects[params.project]?.getBuild(getURL(url), params.version, params.build),
		);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds/:build/download',
	withParams,
	async ({ project, version, build }: { project: string; version: string; build: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}

		return await projects[project]?.getDownload(version, build);
	},
);

router.all('*', () => missing('Not Found'));

addEventListener('fetch', (event: FetchEvent) => {
	event.respondWith(router.handle(event.request));
});
