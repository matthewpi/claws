import { Router } from 'itty-router';
import {
	error as ittyError,
	json as ittyJson,
	missing,
	StatusError,
	withParams,
} from 'itty-router-extras';

import categories from '~/categories';
import projects from '~/projects';

const router = Router();

function getURL(url: string) {
	const u = new URL(url);
	return u.protocol + '//' + u.host;
}

function text(v: string): Response {
	const r = new Response(v);
	r.headers.set('Content-Type', 'text/plain; charset=utf-8');
	r.headers.set('Access-Control-Allow-Origin', '*');
	r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	r.headers.set('Cache-Control', 'no-store');
	r.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
	r.headers.set('X-Frame-Options', 'DENY');
	return r;
}

function json(v: any): Response {
	const r = ittyJson(v);
	r.headers.set('Access-Control-Allow-Origin', '*');
	r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	r.headers.set('Cache-Control', 'no-store');
	r.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
	r.headers.set('X-Frame-Options', 'DENY');
	return r;
}

function formatError(status: number, payload?: any): Response {
	const r = ittyError(status, payload);
	r.headers.set('Access-Control-Allow-Origin', '*');
	r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	r.headers.set('Cache-Control', 'no-store');
	r.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
	r.headers.set('X-Frame-Options', 'DENY');
	return r;
}

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

router.get('/', () => text('Hello, world!'));

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
	const p = projects[project];
	const provider = p.provider;
	if (provider === undefined) {
		throw new Error('fuck');
	}
	return json(await provider.getProject());
});

router.get(
	'/api/v1/projects/:project/versions',
	withParams,
	async ({ project }: { project: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}
		const p = projects[project];
		const provider = p.provider;
		if (provider === undefined) {
			throw new Error();
		}
		const res = await provider.getProject();
		if (res === null) {
			return json(null);
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
		const p = projects[project];
		const provider = p.provider;
		if (provider === undefined) {
			throw new Error();
		}
		return json(await provider.getVersion(version));
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds',
	withParams,
	async ({ project, version }: { project: string; version: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}
		const p = projects[project];
		const provider = p.provider;
		if (provider === undefined) {
			throw new Error();
		}
		const res = await provider.getVersion(version);
		if (res === null) {
			return json(null);
		}
		return json(res.builds);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds/:build',
	withParams,
	async ({
		params: { project, version, build },
		url,
	}: {
		params: { project: string; version: string; build: string };
		url: string;
	}) => {
		if (!(project in projects)) {
			return missing('project not found');
		}
		const p = projects[project];
		const provider = p.provider;
		if (provider === undefined) {
			throw new Error();
		}
		const res = await provider.getBuild(version, build);
		if (res === null) {
			return json(null);
		}
		res.download.url = getURL(url) + res.download.url;
		return json(res);
	},
);

router.get(
	'/api/v1/projects/:project/versions/:version/builds/:build/download',
	withParams,
	async ({ project, version, build }: { project: string; version: string; build: string }) => {
		if (!(project in projects)) {
			return missing('project not found');
		}
		const p = projects[project];
		const provider = p.provider;
		if (provider === undefined) {
			throw new Error();
		}
		const res = await provider.getDownload(version, build);
		if (res === null) {
			return json(null);
		}
		return res;
	},
);

router.all('*', () => missing('Not Found'));

export default {
	async fetch(request: FetchEvent): Promise<Response> {
		return router.handle(request as unknown as Request).catch(async (error: any) => {
			if (error instanceof StatusError) {
				const e = error as StatusError;

				// @ts-expect-error
				return formatError(e.status, e.message);
			}

			console.error(error);
			return formatError(500, 'internal server error');
		});
	},
};
