/**
 * feedback.js
 * 
 * Displays a feedback form and collect user votes   
 */


var feedbackData = [],
    articleId = mw.config.get( 'wgArticleId' ),
    namespace = mw.config.get( 'wgCanonicalNamespace' ),
    action = mw.config.get( 'wgAction' ),
    mwTitle = mw.Title.newFromText( mw.config.get( 'wgPageName' ) ),
    talkPage = mwTitle.getTalkPage(),
    isTalkPage = mwTitle.isTalkPage(),
    talkPageUrl = talkPage.getUrl(),
    supportedNamespaces = ['User'],
    display = '#catlinks',
    prevVote = '';

function getPreviousVote() {
    return mw.cookie.get( 'vote' );
}

function collectVote( response ) {
    if ( getPreviousVote() ) {
        return;
    }

    if ( response === 'yes' ) {
        feedbackData.push( {
            page_id: articleId,
            vote: 'yes'
        } );

        /*
         * Uncomment the line below only when you are ready to deploy the gadget on a production wiki
         */
        //mw.eventLog.logEvent(  'UserFeedback', { page_id: articleId, vote: "Yes" }  );
    }

    if ( response === 'no' ) {
        feedbackData.push( {
            page_id: articleId,
            vote: 'no'
        } );

        /*
         * Uncomment the line below only when you are ready to deploy the gadget on a production wiki
         */

        //mw.eventLog.logEvent(  'UserFeedback', { page_id: articleId, vote: "no" }  );
    }

    setCookie( response );
    showConfirmationMsg( response );
    console.log( feedbackData );
}

function setCookie( response ) {
    var expInSecs = 600; //10 minutes

    mw.cookie.set( 'vote', response, { 'expires': expInSecs } );
}

function showConfirmationMsg( response ) {
    $( '#mw-userfeedback-form' ).empty();

    if ( response === 'yes' ) {
        $( '#mw-userfeedback-form' ).append( '<span> Thank you for the' +
            ' feedback. We are glad that you found the documentation' +
            ' useful! </span>' );
    }

    if ( response === 'no' ) {
        $( '#mw-userfeedback-form' ).append( '<span> Thank you for the' +
            ' feedback. It would be helpful if you could leave some' +
            ' suggestions for improving the article on its' +
            ' <a href="' + mw.html.escape( talkPageUrl ) + '" target="blank">' +
            'talk page</a>. </span>' );
    }
}

$( document ).ready( function() {
    if ( action !== 'view' ||
        namespace.indexOf( supportedNamespaces ) === -1 ||
        isTalkPage ) {
        return;
    }
    if ( $( display ).length === 0 ) {
        display = '#mw-content-text';
    }
    $( display ).after( '<div id="mw-userfeedback-form"></div>' );

    prevVote = getPreviousVote();

    if ( prevVote === 'yes' || prevVote === 'no' ) {
        showConfirmationMsg( prevVote );
    } else {
        $( '#mw-userfeedback-form' ).append( '<span>' +
            'Was this documentation helpful? </span>' );
        $( '#mw-userfeedback-form' ).append( '<a id="mw-userfeedback-thumbs-up"' +
            'class="thumbs thumbs-up">👍</a>' );
        $( '#mw-userfeedback-form' ).append( '<a id="mw-userfeedback-thumbs-down"' +
            'class="thumbs thumbs-down">👎</a>' );
    }

    $( '#mw-userfeedback-thumbs-up' ).click( function() {
        collectVote( 'yes' );
    } );

    $( '#mw-userfeedback-thumbs-down' ).click( function() {
        collectVote( 'no' );
    } );

} );
