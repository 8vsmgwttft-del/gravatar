export function escHtml( str: string ) {
	const htmlEntities: Record< string, string > = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'`': '&#x60;',
	};

	// Don't escape if already escaped.
	return str.replace( /&(amp|lt|gt|quot|#39|x60);|[\&<>"'`]/g, ( match ) =>
		match[ 0 ] === '&' ? match : htmlEntities[ match ]
	);
}

export function escUrl( url: string ) {
	const isRelativeUrl = ! /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test( url ) && ! url.startsWith( '//' );

	if ( isRelativeUrl ) {
		return encodeURI( url );
	}

	try {
		const parsedUrl = new URL( url );
		const allowedProtocols = new Set( [ 'http:', 'https:', 'mailto:', 'tel:' ] );

		if ( ! allowedProtocols.has( parsedUrl.protocol ) ) {
			return '';
		}

		return encodeURI( url );
	} catch ( _ ) {
		return '';
	}
}
