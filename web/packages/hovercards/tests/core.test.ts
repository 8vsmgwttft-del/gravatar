import { Hovercards } from '../src';
import addQueryArg from '../src/add-query-arg';

describe( 'Hovercards profile behavior', () => {
	it( 'escapes contact and payment profile content before rendering', () => {
		const hovercard = Hovercards.createHovercard( {
			hash: 'hash',
			avatarUrl: 'https://gravatar.com/avatar',
			profileUrl: 'https://gravatar.com/tester"><img src=x onerror=alert(1)>',
			displayName: 'Tester',
			contactInfo: {
				email: 'person@example.com"><img src=x onerror=alert(1)>',
			},
			payments: {
				links: [
					{
						label: 'Support <img src=x onerror=alert(1)>',
						url: 'https://example.com/donate?quote="value"',
					},
				],
				crypto_wallets: [
					{
						label: 'BTC <img src=x onerror=alert(1)>',
						address: 'abc"><img src=x onerror=alert(1)>',
					},
				],
			},
		} );

		expect( hovercard.querySelectorAll( 'img[onerror]' ) ).toHaveLength( 0 );

		const profileUrl = hovercard.querySelector( '.gravatar-hovercard__profile-url' );
		expect( profileUrl?.textContent ).toContain( 'gravatar.com/tester"><img src=x onerror=alert(1)>' );
		expect( profileUrl?.getAttribute( 'title' ) ).toBe(
			'https://gravatar.com/tester"><img src=x onerror=alert(1)>'
		);

		const labels = Array.from( hovercard.querySelectorAll( '.gravatar-hovercard__drawer-item-label' ) ).map(
			( item ) => item.textContent
		);
		expect( labels ).toContain( 'Support <img src=x onerror=alert(1)>' );
		expect( labels ).toContain( 'BTC <img src=x onerror=alert(1)>' );

		const contactLink = hovercard.querySelector(
			'.gravatar-hovercard__drawer[data-drawer="contact"] .gravatar-hovercard__drawer-item-link'
		);
		expect( contactLink?.textContent ).toBe( 'person@example.com"><img src=x onerror=alert(1)>' );
		expect( contactLink?.getAttribute( 'href' ) ).toBe(
			'mailto:person@example.com%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E'
		);

		const paymentLink = hovercard.querySelector(
			'.gravatar-hovercard__drawer[data-drawer="send-money"] .gravatar-hovercard__drawer-item-link'
		);
		expect( paymentLink?.textContent ).toBe( 'example.com/donate?quote="value"' );
		expect( paymentLink?.getAttribute( 'href' ) ).toBe( 'https://example.com/donate?quote=%22value%22' );

		const walletAddress = hovercard.querySelectorAll( '.gravatar-hovercard__drawer-item-text' )[ 2 ];
		expect( walletAddress?.textContent ).toBe( 'abc"><img src=x onerror=alert(1)>' );
	} );

	it( 'returns an empty string when adding a query arg to an invalid profile URL', () => {
		expect( addQueryArg( 'not a url', 'utm_source', 'hovercard' ) ).toBe( '' );
	} );
} );
