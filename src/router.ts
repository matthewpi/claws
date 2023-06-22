import { Router as IttyRouter, RouterOptions } from 'itty-router';
import {
	error as ittyError,
	json as ittyJson,
	missing,
	StatusError,
	withParams,
} from 'itty-router-extras';

import categories from '~/categories';
import projects from '~/projects';
import { Provider } from '~/schema';

export class Router<TRequest = Request, TMethods = Record<string, never>> {
	private router: IttyRouter<TRequest, TMethods>;

	constructor(options?: RouterOptions<TRequest>) {
		this.router = IttyRouter(options);

		this.router.options('*', (req: Request) => {
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

		this.router.get('/', () => this.text('Hello, world!'));
		this.createCategoryRoutes();
		this.createProjectRoutes();
		this.createVersionRoutes();
		this.createModpackRoutes();
		this.router.all('*', () => missing('Not Found'));
	}

	private createCategoryRoutes(): void {
		this.router.get('/api/v1/categories', () => {
			const data = [];
			data.push(...Object.keys(categories).map(k => ({ name: categories[k].name, slug: categories[k].slug })));

			return this.json(data);
		});

		this.router.get('/api/v1/categories/:category', withParams, ({ category }: { category: string }) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			return this.json(categories[category]);
		});

		this.router.get('/api/v1/categories/:category/providers', withParams, ({ category }: { category: string }) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			const data: string[] = [];
			if (categories[category].modProviders.length > 0) data.push('mods');
			if (categories[category].projectProviders.length > 0) data.push('projects');

			return this.json(data);
		});

		this.router.get('/api/v1/categories/:category/providers/:provider', withParams, ({ category, provider }: { category: string, provider: string }) => {
			if (!(category in categories)) {
				return missing('category not found');
			}

			const data: Provider[] = [];
			if (provider === 'mods') data.push(...categories[category].modProviders);
			else if (provider === 'projects') data.push(...categories[category].projectProviders);

			return this.json(data);
		});
	}

	private createProjectRoutes(): void {
		this.router.get('/api/v1/projects', () => {
			const data = [];
			data.push(...Object.keys(projects).map(k => ({ name: projects[k].name, slug: projects[k].slug })));

			return this.json(data);
		});

		this.router.get('/api/v1/projects/:project', withParams, async ({ project }: { project: string }) => {
			if (!(project in projects)) return missing('project not found');

			const p = projects[project];
			const provider = p.provider;
			if (provider === undefined) throw new Error('fuck');

			return this.json(await provider.getProject());
		});
	}

	private createVersionRoutes(): void {
		this.router.get(
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
					return this.json(null);
				}
				return this.json(res.versions);
			},
		);

		this.router.get(
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
				return this.json(await provider.getVersion(version));
			},
		);

		this.router.get(
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
					return this.json(null);
				}
				return this.json(res.builds);
			},
		);

		this.router.get(
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
					return this.json(null);
				}
				res.download.url = this.getURL(url) + res.download.url;
				return this.json(res);
			},
		);

		this.router.get(
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
					return this.json(null);
				}
				return res;
			},
		);
	}

	private createModpackRoutes(): void {

	}

	public handleRequest(request: TRequest): Promise<Response> {
		return this.router.handle(request).catch(async (error: any) => {
			if (error instanceof StatusError) {
				const e = error as StatusError & { status: number };

				return this.formatError(e.status, e.message);
			}


			console.error(error);
			return this.formatError(500, 'internal server error');
		});
	}

	private getURL(url: string): string {
		const u = new URL(url);
		return u.protocol + '//' + u.host;
	}

	private text(v: string): Response {
		const r = new Response(v);
		r.headers.set('Content-Type', 'text/plain; charset=utf-8');
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}

	private json(v: any): Response {
		const r = ittyJson(v);
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}

	private formatError(status: number, payload?: any): Response {
		const r = ittyError(status, payload);
		r.headers.set('Access-Control-Allow-Origin', '*');
		r.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		r.headers.set('Cache-Control', 'no-store');
		r.headers.set('Content-Security-Policy', 'frame-ancestors \'none\'');
		r.headers.set('X-Frame-Options', 'DENY');
		return r;
	}
}
