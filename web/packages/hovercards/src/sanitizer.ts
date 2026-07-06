const ALLOWED_PROTOCOLS = new Set( [ 'http:', 'https:', 'mailto:', 'tel:' ] );

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
	const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test( url );
	const isProtocolRelativeUrl = url.startsWith( '//' );
	const isRelativeUrl = ! hasProtocol && ! isProtocolRelativeUrl;

	if ( isRelativeUrl ) {
		return encodeURI( url );
	}

	try {
		const parsedUrl = isProtocolRelativeUrl ? new URL( `https:${ url }` ) : new URL( url );

		if ( ! ALLOWED_PROTOCOLS.has( parsedUrl.protocol ) ) {
			return '';
		}

		return encodeURI( url );
	} catch ( _ ) {
		return '';
	}
}
