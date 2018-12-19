/**
 * feedback.js
 * 
 * Displays a feedback form and collect user votes   
 */
mw.loader.using( 'oojs-ui-core', 'ext.eventLogging' ).done( function() {
    var feedbackData = [],
        title = mw.config.get( 'wgTitle' ),
        articleId = mw.config.get( 'wgArticleId' ),
        namespace = mw.config.get( 'wgCanonicalNamespace' ),
        namespaceNum = mw.config.get( 'wgNamespaceNumber' ),
        action = mw.config.get( 'wgAction' ),
        talkPage = mw.Title.newFromText( title, namespaceNum ).getTalkPage(),
        talkPageUrl = talkPage.getUrl(),
        supportedNamespaces = ["User"],
        display = '#catlinks',
        prevVote = '';

    function getPreviousVote() {
        var start,
            end,
            cookie = document.cookie;

        if ( cookie ) {
            start = cookie.search( 'vote=' );
            end = cookie.search( ';' );

            if ( start !== -1 ) {
                cookie = cookie.substring( start + 9, end );
                cookie = cookie.substring( 5, cookie.length );

                return cookie;
            }
        }

        return null;
    }

    function collectVote( response ) {
        if ( getPreviousVote() ) {
            return;
        }

        if ( response == "yes" ) {
            feedbackData.push( {
                page_id: articleId,
                vote: "yes"
            } );

            /*
             * [TODO] Replace the above line with > mw.eventLog.logEvent(  
             * 'UserFeedback', { page_id: articleId, vote: "Yes" }  );
             */
        }

        if ( response == "no" ) {
            feedbackData.push( {
                page_id: articleId,
                vote: "no"
            } );

            /*
             * [TODO] Replace the above line with > //mw.eventLog.logEvent(  
             * 'UserFeedback', { page_id: articleId, vote: "no" }  );
             */
        }

        setCookie( response );
        showConfirmationMsg( response );
        console.log( feedbackData );
    }

    function setCookie( response ) {
        document.cookie = "vote=" + response + ";";
    }

    function showConfirmationMsg( response ) {
        $( "#doc-feedback-form" ).empty();

        if ( response == "yes" ) {
            $( "#doc-feedback-form" ).append( "<span> Thank you for the" +
                " feedback. We are glad that you found the documentation" +
                " useful! </span>" );
        }

        if ( response == "no" ) {
            $( "#doc-feedback-form" ).append( "<span> Thank you for the" +
                " feedback. It would be helpful if you could provide more" +
                " information on what needs improvement on the article's" +
                " <a href='" + talkPageUrl + "' target='blank'>" +
                "talk page.</a> </span>" );
        }
    }

    $( document ).ready( function() {
        var yesButton = new OO.ui.ButtonWidget( {
                label: 'Yes'
            } ),
            noButton = new OO.ui.ButtonWidget( {
                label: 'No'
            } );

        if ( action !== "view" ||
            namespace.indexOf( supportedNamespaces ) == -1 ) {
            return;
        }
        if ( $( display ).length == 0 ) {
            display = '#mw-content-text';
        }
        $( display ).after( "<div id='doc-feedback-form'></div>" );

        prevVote = getPreviousVote();

        if ( prevVote == "yes" || prevVote == "no" ) {
            showConfirmationMsg( prevVote );
        } else {
            $( "#doc-feedback-form" ).append( '<span>' +
                'Was this documentation helpful? </span>' );
            $( "#doc-feedback-form" ).append( yesButton.$element );
            $( "#doc-feedback-form" ).append( noButton.$element );
        }

        yesButton.on( 'click', function(  ) {
            collectVote( "yes" );
        } );

        noButton.on( 'click', function(  ) {
            collectVote( "no" );
        } );

    } );

} );
