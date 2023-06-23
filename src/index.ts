import { Router } from '~/router';

const router = new Router();

export default {
	async fetch(request: FetchEvent): Promise<Response> {
		return router.handleRequest(request as unknown as Request);
	},
};
