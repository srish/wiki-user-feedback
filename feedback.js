/**
 * feedback.js
 * 
 * Displays a feedback form and collect user votes   
 */

mw.loader.using( 'oojs-ui-core' ).done( function () {
	$( function () {
		var yesButton = new OO.ui.ButtonWidget( { label: 'Yes' } ),
			noButton = new OO.ui.ButtonWidget( { label: 'No' } ),
	
			hasUserVoted = false,
			feedbackData  = [],
			apiUrl = mw.config.get( 'wgServer' ) + '/w/api.php',
			curPageId = mw.config.get( 'wgArticleId' );
		
		$.getJSON( apiUrl, {
			action: "query",
			format: "json",
			pageids: curPageId,
			prop: "categories"
		} ).
		done( function( data ) {
			var cats = data.query.pages[curPageId].categories;

			if( cats && cats.length >= 0 ) {
				$( '#catlinks' ).after( noButton.$element );
				$( '#catlinks' ).after( yesButton.$element );
				$( '#catlinks' ).after( 'Was this documentation helpful? ' );
				$( '#catlinks' ).after( '<br>' );
			} else {
				$( '#mw-content-text' ).after( noButton.$element );
				$( '#mw-content-text' ).after( yesButton.$element );
				$( '#mw-content-text' ).after( 'Was this documentation helpful? ' );
				$( '#mw-content-text' ).after( '<br>' );
			}
		} );

		yesButton.on( 'click', function() {
			collectVote( "Yes" );
		} );
	
		noButton.on( 'click', function() {
			collectVote( "No" );
		} );
	
		function collectVote( response ) {
			if( !hasUserVoted && response == "Yes" ) {
				hasUserVoted  = true;
				feedbackData.push( { page_id: curPageId, vote: "Yes" } );
			}
	
			if( hasUserVoted && response == "No" ) {
				hasUserVoted  = false;
				feedbackData.push( { page_id: curPageId, vote: "No" } );
			}

			console.log( feedbackData );
		}
	} );
} );
