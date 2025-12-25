export const getQueryString = (
	existingParams: Record<string, string | string[] | undefined>,
	newParams: Record<string, string | string[] | undefined> = {},
): string => {
	const params = { ...existingParams, ...newParams };

	for (const param of Object.keys(params)) {
		if (typeof params[param] !== "string") {
			delete params[param];
		}
	}

	return `?${new URLSearchParams(params as Record<string, string>).toString()}`;
};
