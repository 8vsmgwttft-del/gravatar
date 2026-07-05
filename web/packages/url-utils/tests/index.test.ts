import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { avatarUrl, GravatarDefault, GravatarFormat, GravatarRating, profileUrl } from '../src/index';

describe( 'avatarUrl function', () => {
	let consoleErrorSpy: any;

	beforeEach( () => {
		consoleErrorSpy = jest.spyOn( global.console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		consoleErrorSpy.mockRestore();
	} );

	it( 'should log an error for an empty email', () => {
		avatarUrl( '' );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( 'Valid email is required' );
	} );

	it( 'should log an error for an email with only spaces', () => {
		avatarUrl( '    ' );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( 'Valid email is required' );
	} );

	it( 'should log an error for a null email', () => {
		avatarUrl( null );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( 'Valid email is required' );
	} );

	it( 'should return valid gravatar url with an email and no option', () => {
		expect( avatarUrl( 'test@test.com' ) ).toBe(
			'https://www.gravatar.com/avatar/f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a'
		);
	} );

	it( 'should return valid gravatar url with an email with options', () => {
		expect( avatarUrl( 'test@test.com', { default: GravatarDefault.MYSTERY_PERSON } ) ).toBe(
			'https://www.gravatar.com/avatar/f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a?default=mp'
		);
	} );

	it( 'should return valid gravatar url with an email with multiple options', () => {
		expect( avatarUrl( 'test@test.com', { default: GravatarDefault.MONSTERID, size: 42 } ) ).toBe(
			'https://www.gravatar.com/avatar/f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a?default=monsterid&size=42'
		);
	} );

	it( 'should trim leading spaces on input email', () => {
		expect( avatarUrl( '   example@example.com' ) ).toBe( avatarUrl( 'example@example.com' ) );
	} );

	it( 'should trim trailing spaces on input email', () => {
		expect( avatarUrl( 'example@example.com   ' ) ).toBe( avatarUrl( 'example@example.com' ) );
	} );

	it( 'should trim leading and trailing spaces on input email', () => {
		expect( avatarUrl( '   example@example.com   ' ) ).toBe( avatarUrl( 'example@example.com' ) );
	} );

	it( 'should lower case input email', () => {
		expect( avatarUrl( 'example@EXAMPLE.com' ) ).toBe( avatarUrl( 'example@example.com' ) );
	} );

	it( 'should trim spaces and lower case input email', () => {
		expect( avatarUrl( ' EXample@EXAMPLE.com  ' ) ).toBe( avatarUrl( 'example@example.com' ) );
	} );

	it( 'should not add any query param if not passed options', () => {
		expect( avatarUrl( 'example@example.com' ) ).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66'
		);
	} );

	it( 'should set the size query param if passed as an option', () => {
		expect( avatarUrl( 'example@example.com', { size: 1000 } ) ).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?size=1000'
		);
	} );

	it( 'should add default avatar but no other query param if not set', () => {
		expect( avatarUrl( 'example@example.com', { default: GravatarDefault.MONSTERID } ) ).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?default=monsterid'
		);
	} );

	it( 'should add size and default avatar query params when created via an email address', () => {
		expect(
			avatarUrl( 'example@example.com', {
				size: 42,
				default: GravatarDefault.IDENTICON,
			} )
		).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?size=42&default=identicon'
		);
	} );

	it( 'should add all supported parameters', () => {
		expect(
			avatarUrl( 'example@example.com', {
				size: 42,
				default: GravatarDefault.ROBOHASH,
				rating: GravatarRating.X,
				forceDefault: true,
			} )
		).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?size=42&default=robohash&rating=x&forcedefault=y'
		);
	} );

	it( 'should support custom URL and encode them when created via an email address', () => {
		expect(
			avatarUrl( 'example@example.com', {
				default: 'https://example.com/?encoded=true&please=yes',
			} )
		).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?default=https%3A%2F%2Fexample.com%2F%3Fencoded%3Dtrue%26please%3Dyes'
		);
	} );

	it( 'should generate forcedefault=n when force default avatar is false', () => {
		expect(
			avatarUrl( 'example@example.com', {
				forceDefault: false,
			} )
		).toBe(
			'https://www.gravatar.com/avatar/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66?forcedefault=n'
		);
	} );

	it( 'should log an error if an invalid size value is passed', () => {
		avatarUrl( 'example@example.com', { size: -1 } );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( "Invalid value for 'size'. It must be a positive number." );
	} );

	it( 'should log an error if an invalid default value is passed', () => {
		avatarUrl( 'example@example.com', { default: 'invalid' as GravatarDefault } );
		expect( consoleErrorSpy ).toHaveBeenCalledWith(
			"Invalid value for 'default'. It must be one of the accepted default image types or a valid URL."
		);
	} );

	it( 'should log an error if an invalid rating value is passed', () => {
		avatarUrl( 'example@example.com', { rating: 'invalid' as GravatarRating } );
		expect( consoleErrorSpy ).toHaveBeenCalledWith(
			"Invalid value for 'rating'. It must be one of the accepted rating."
		);
	} );

	it( 'should log an error if an invalid forceDefault value is passed', () => {
		avatarUrl( 'example@example.com', { forceDefault: 'invalid' as unknown as boolean } );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( "Invalid value for 'forceDefault'. It must be a boolean." );
	} );

	it( 'should log an error if an invalid default URL is passed', () => {
		avatarUrl( 'example@example.com', { default: '://invalidURL' } );
		expect( consoleErrorSpy ).toHaveBeenCalledWith(
			"Invalid value for 'default'. It must be one of the accepted default image types or a valid URL."
		);
	} );
} );

describe( 'profileUrl function', () => {
	let consoleErrorSpy: any;

	beforeEach( () => {
		consoleErrorSpy = jest.spyOn( global.console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		consoleErrorSpy.mockRestore();
	} );

	it( 'should trim leading spaces on input email', () => {
		expect( profileUrl( '   example@example.com' ) ).toBe( profileUrl( 'example@example.com' ) );
	} );

	it( 'should trim trailing spaces on input email', () => {
		expect( profileUrl( 'example@example.com   ' ) ).toBe( profileUrl( 'example@example.com' ) );
	} );

	it( 'should trim leading and trailing spaces on input email', () => {
		expect( profileUrl( '   example@example.com   ' ) ).toBe( profileUrl( 'example@example.com' ) );
	} );

	it( 'should lower case input email', () => {
		expect( profileUrl( 'example@EXAMPLE.com' ) ).toBe( profileUrl( 'example@example.com' ) );
	} );

	it( 'should trim spaces and lower case input email', () => {
		expect( profileUrl( ' EXample@EXAMPLE.com  ' ) ).toBe( profileUrl( 'example@example.com' ) );
	} );

	it( 'should not add any format if no parameter is passed', () => {
		expect( profileUrl( 'example@example.com' ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66'
		);
	} );

	it( 'should not add any format if HTML parameter is passed', () => {
		expect( profileUrl( 'example@example.com', GravatarFormat.HTML ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66'
		);
	} );

	it( 'should add format .xml in case of XML selected', () => {
		expect( profileUrl( 'example@example.com', GravatarFormat.XML ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66.xml'
		);
	} );

	it( 'should add format .json in case of JSON selected', () => {
		expect( profileUrl( ' EXample@EXAMPLE.com  ', GravatarFormat.JSON ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66.json'
		);
	} );

	it( 'should add format .php in case of PHP selected', () => {
		expect( profileUrl( 'example@example.com', GravatarFormat.PHP ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66.php'
		);
	} );

	it( 'should add format .vcf in case of VCF selected', () => {
		expect( profileUrl( 'example@example.com', GravatarFormat.VCF ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66.vcf'
		);
	} );

	it( 'should add format .qr in case of QR selected', () => {
		expect( profileUrl( 'example@example.com', GravatarFormat.QR ) ).toBe(
			'https://www.gravatar.com/31c5543c1734d25c7206f5fd591525d0295bec6fe84ff82f946a34fe970a1e66.qr'
		);
	} );

	it( 'should log an error if an invalid format is passed', () => {
		profileUrl( 'example@example.com', 'invalid' as GravatarFormat );
		expect( consoleErrorSpy ).toHaveBeenCalledWith(
			"Invalid value for 'format'. It must be one of the accepted profile formats."
		);
	} );

	it( 'should log an error if an empty email is passed', () => {
		profileUrl( '' );
		expect( consoleErrorSpy ).toHaveBeenCalledWith( 'Valid email is required' );
	} );
} );
