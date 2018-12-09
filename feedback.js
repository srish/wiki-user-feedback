/**
 * feedback.js
 * 
 * Displays a feedback form and collect user votes   
 */

$( function () {
	var yesButton = new OO.ui.ButtonWidget( { label: 'Yes' } ),
		noButton = new OO.ui.ButtonWidget( { label: 'No' } ),

		hasUserVoted = false,
		feedbackData  = [];

	yesButton.on( 'click', function() {
		collectVote( "Yes" );
	} );

	noButton.on( 'click', function() {
		collectVote( "No" );
	} ); 

	function collectVote( response ) {
		var pageID = 12; // mw.config.get( 'wgArticleId' ); 

		if( !hasUserVoted && response == "Yes" ) {
			hasUserVoted  = true;
			feedbackData.push( { pageId: pageID, vote: "Yes" } );	
		}

		if( hasUserVoted && response == "No" ) {
			hasUserVoted  = false;
			feedbackData.push( { pageId: pageID, vote: "No" } );
		}

		console.log( feedbackData );
	}

	//TODO: Replace `body` with `#mw-content-text`
	$( 'body' ).append( 'Was this documentation helpful? ' );
	$( 'body' ).append( yesButton.$element );
	$( 'body' ).append( noButton.$element );
} );
