import { escUrl } from '../src/sanitizer';

describe( 'escUrl', () => {
	it( 'returns encoded values for allowed URLs', () => {
		expect( escUrl( 'https://example.com?q="quoted"' ) ).toBe( 'https://example.com?q=%22quoted%22' );
		expect( escUrl( 'mailto:user@example.com' ) ).toBe( 'mailto:user@example.com' );
		expect( escUrl( '/profiles/test?value=hello world' ) ).toBe( '/profiles/test?value=hello%20world' );
	} );

	it( 'rejects disallowed protocols and malformed URLs', () => {
		expect( escUrl( 'javascript:alert(1)' ) ).toBe( '' );
		expect( escUrl( 'data:text/html,<img src=x onerror=alert(1)>' ) ).toBe( '' );
		expect( escUrl( 'http://[invalid' ) ).toBe( '' );
	} );
} );
