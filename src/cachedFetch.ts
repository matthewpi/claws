const cachedFetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
	const options = {
		...init,
		cf: {
			cacheEverything: true,
			cacheTtl: 5 * 60,
		},
	};
	options.headers = {
		...options.headers,
		Accept: 'application/json',
		// TODO: Add USER_AGENT back here.
	};
	return fetch(input, options);
};

export default cachedFetch;
