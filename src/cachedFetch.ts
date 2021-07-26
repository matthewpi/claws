const cachedFetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
	return fetch(input, {
		...init,
		cf: {
			cacheEverything: true,
			cacheTtl: 60,
		},
	});
};

export default cachedFetch;
