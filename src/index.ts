import { json, missing, ThrowableRouter, withParams } from 'itty-router-extras';

import categories from '~/categories';
import projects from '~/projects';

const router = ThrowableRouter();

const getURL = (url: string) => {
	const u = new URL(url);
	return u.protocol + '//' + u.host;
};

const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
	'Cache-Control': 'no-store',
	'Content-Security-Policy': "frame-ancestors 'none'",
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
};

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

router.get('/api/v1/categories/:category/projects', withParams, ({ category }: { category: string }) => {
	if (!(category in categories)) {
		return missing('category not found');
	}

	return json(categories[category].projects);
});

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

router.get('/api/v1/projects/:project/versions', withParams, async ({ project }: { project: string }) => {
	if (!(project in projects)) {
		return missing('project not found');
	}

	return json((await projects[project]?.toAPI()).versions);
});

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

		return json((await projects[project]?.getVersion(version)).builds);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds/:build',
	async ({ params, url }: { params: { project: string; version: string; build: string }; url: string }) => {
		if (!(params.project in projects)) {
			return missing('project not found');
		}

		return json(await projects[params.project]?.getBuild(getURL(url), params.version, params.build));
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

addEventListener('fetch', async (event: FetchEvent) => {
	// const r: Response = await router.handle(event.request);
	// const options = r;
	// Object.keys(DEFAULT_SECURITY_HEADERS).forEach((k) => {
	// 	options.headers.set(k, DEFAULT_SECURITY_HEADERS[k]);
	// });
	// event.respondWith(new Response(r.body, options));
	event.respondWith(router.handle(event.request));
});
