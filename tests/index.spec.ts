import { describe, expect, it } from 'vitest';

import { handleRequest } from '../src';

describe('handleRequest', () => {
	it('responds with a 200 status code', async () => {
		const request = new Request('http://localhost');
		const response = await handleRequest(request);

		expect(response.status).toBe(200);
	});
});
