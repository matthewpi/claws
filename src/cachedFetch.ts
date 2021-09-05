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
		'User-Agent': USER_AGENT,
	};
	return fetch(input, options);
};

export default cachedFetch;
