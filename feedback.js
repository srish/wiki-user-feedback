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
			curPageId = mw.config.get( 'wgArticleId' ),
			displayAfter = '#catlinks';
		
		if ( $( displayAfter ).length == 0 ) {
			displayAfter = '#mw-conent-text';
		}

		$( displayAfter ).after( noButton.$element );
		$( displayAfter ).after( yesButton.$element );
		$( displayAfter ).after( 'Was this documentation helpful? ' );
		$( displayAfter ).after( '<br>' );

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
