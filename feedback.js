/**
 * feedback.js
 * 
 * Displays a feedback form and collect user votes   
 */

$( function () {
	var yesButton = new OO.ui.ButtonWidget( { label: 'Yes' } );
	var noButton = new OO.ui.ButtonWidget( { label: 'No' } );

	yesButton.on( 'click', function() {
		modifyVotes( "Yes" );
	} );

	noButton.on( 'click', function() {
		modifyVotes( "No" );
	} ); 

	function modifyVotes(response) {
		var feedbackData = [],
			hasUserVoted = false,
			i, 
			j,
			pageGotVotes = false,
			pageID = 11, // TODO: replace value with mw.config.get('wgArticleId')
			userName = "Tux", // TODO: replace value with mw.config.get('wgUserName') or mw.user.getId()
			voters = [];


		if ( feedbackData ) {
			for ( i = 0; i < feedbackData.length; i++ ) { 
				if( feedbackData[i] ) {
					if ( feedbackData[i]['pageId'] == pageID ) {
						pageGotVotes = true;

						voters = feedbackData[i]['voters'];
						
						for ( j = 0; j < voters.length; j++ ) {
							if ( voters[j] == userName ) {
								hasUserVoted = true;
								break;
							}
						}
						
						if( !hasUserVoted && response == "Yes" ) {
							var votes = feedbackData[i]['votes'];

							if( !votes )
								votes = 0;

							feedbackData[i]['votes'] = votes + 1;
							voters.push( userName );
						}

						if( hasUserVoted && response == "No" ) {
							if ( feedbackData[i]['votes'] > 0 ) {
								feedbackData[i]['votes'] = feedbackData[i]['votes'] - 1;
								voters.splice( userName );
							}
						}
						
						break;
					}
				}
			}
		}

		if( !pageGotVotes && response == "Yes" ) {
			feedbackData.push( { pageId: pageID, votes: 1, voters: [userName] } );
		}

		console.log(feedbackData);

	}

	//TODO: Replace `body` with `#mw-content-text`
	$( 'body' ).append( 'Was this documentation helpful? ' );
	$( 'body' ).append( yesButton.$element );
	$( 'body' ).append( noButton.$element );
} );
