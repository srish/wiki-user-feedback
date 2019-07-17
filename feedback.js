/**
 * userfeedback.js
 * 
 * Collect user votes on the helpfulness/quality of a documenation page by
 * posting an EventLogging log event to the "UserFeedback" channel.
 * 
 * @source https://wikitech.wikimedia.org/wiki/MediaWiki:Gadget-userfeedback.js
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 * @licstart  The following is the entire license notice for the JavaScript code in this gadget.
 * 
 * Copyright (C) 2019 Srishti Sethi <https://meta.wikimedia.org/wiki/User:SSethi_(WMF)> and contributors
 * 
 * The JavaScript/Gadget code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 * 
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 * 
 * @licend  The above is the entire license notice for the JavaScript/Gadget code in this gadget.
 */
(function ($) {
  'use strict';

	var supportedNamespaces = [ 'API' ],
		validVotes = [ 'yes', 'no' ],
		articleId = mw.config.get( 'wgArticleId' ),
		namespace = mw.config.get( 'wgCanonicalNamespace' ),
		action = mw.config.get( 'wgAction' ),
		pageName = mw.config.get( 'wgPageName' ),
		voteCookieName = 'vote_' + articleId;

	/**
	 * Check for a prior vote by the current user for the current page.
	 * 
	 * @return {string|null} Prior recorded vote or null if no vote found
	 */
	function getPreviousVote() {
		return mw.cookie.get( voteCookieName );
	}

	/**
	 * Record a vote by posting an EventLogging event and then displaying a
	 * confirmation message to the user.
	 * 
	 * @param {string} vote
	 */
	function collectVote( vote ) {
		if (
			getPreviousVote() !== null ||       // User already voted
			validVotes.indexOf( vote ) === -1   // Invalid vote submitted
		) {
			return;
		}
        mw.eventLog.logEvent( 'UserFeedback', {
			"page_id": articleId,
			"page_name": pageName,
			"vote": vote
		} );
		rememberVote( vote );
		showConfirmationMsg( vote );
	}

	/**
	 * Remember the vote for the current page.
	 * 
	 * @param {string} vote
	 */
	function rememberVote( vote ) {
		var expInSecs = 600; // 10 minutes
		mw.cookie.set( voteCookieName, vote, { 'expires': expInSecs } );
	}

	/**
	 * Display a confirmation message to the user about their vote.
	 * 
	 * @param {string} vote
	 */
	function showConfirmationMsg( vote ) {
		var $feedback = $( '#mw-gadget-userfeedback' );
		$feedback.empty();

		if ( vote === 'yes' ) {
			$feedback.append(
				'<span>Thank you for the feedback. ' +
				'We are glad that you found the documentation useful!</span>'
			);
		} else if ( vote === 'no' ) {
			var title = mw.Title.newFromText( pageName ),
				talkPage = title.getTalkPage(),
				talkPageUrl = talkPage.getUrl();

			$feedback.append(
				'<span>Thank you for the feedback. ' +
				'It would be helpful if you could leave some suggestions ' +
				'for improving the article on its <a href="' +
				mw.html.escape( talkPageUrl ) +
				'" target="blank">talk page</a>.</span>'
			);
		}
	}

	/**
	 * Show the form for voting or a confirmation message if the user has
	 * recently voted on the quality of the curent page.
	 * 
	 * The form is only shown if the current page is not a redlink,
	 * being viewed by the user (rather than edited),
	 * and the page is in a supported namespace.
	 */
	function showGadgetUI() {
		if (
			articleId === 0 ||                              // Page must not be a redlink
			action !== 'view' ||                            // Only show when reading article
			supportedNamespaces.indexOf( namespace ) === -1 // Page must be in supported namespace
		) {
			return;
		}

		var displayAfter = '#catlinks',
			$displayAfter = $( displayAfter ),
			prevVote = getPreviousVote();
	    	
		if ( $displayAfter.length === 0 ) {
			$displayAfter = $( '#mw-content-text' );
		}
		$displayAfter.after( '<div id="mw-gadget-userfeedback"></div>' );

		if ( validVotes.indexOf( prevVote ) !== -1 ) {
			showConfirmationMsg( prevVote );
		} else {
			var $feedback = $( '#mw-gadget-userfeedback' ),
				voteYes = new OO.ui.ButtonWidget( {
					label: '👍',
					title: 'Yes, it was helpful',
					framed: false,
					classes: [ 'thumbs', 'thumbs-up' ]
				} ),
				voteNo = new OO.ui.ButtonWidget( {
					label: '👎',
					title: 'No, it was not helpful',
					framed: false,
					classes: [ 'thumbs', 'thumbs-down' ]
				} ),
				buttonGroup = new OO.ui.ButtonGroupWidget( {
					items: [ voteYes, voteNo ]
				} );
			voteYes.on( 'click', function() { collectVote( 'yes' ); } );
			voteNo.on( 'click', function() { collectVote( 'no' ); } );
			$feedback.append( '<span class="survey-question">Was this documentation helpful?</span>' );
			$feedback.append( buttonGroup.$element );
		}
	}

	$( document ).ready( showGadgetUI );
}(jQuery));
