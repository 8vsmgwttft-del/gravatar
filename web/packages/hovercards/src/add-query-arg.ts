/**
 * Adds or updates a query parameter to the given URL.
 *
 * @param {string} url   - The URL to which the query parameter will be added.
 * @param {string} key   - The query parameter key to add or update.
 * @param {string} value - The value of the query parameter to add or update.
 * @return {string}      - The updated URL with the new or updated query parameter, or an empty string if the URL is invalid.
 */
export default function addQueryArg( url: string, key: string, value: string ): string {
	try {
		const parsedUrl = new URL( url );
		parsedUrl.searchParams.set( key, value );
		return parsedUrl.toString();
	} catch ( _ ) {
		return '';
	}
}
