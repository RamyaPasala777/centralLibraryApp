sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/libraryapp/test/integration/FirstJourney',
		'com/app/libraryapp/test/integration/pages/BooksList',
		'com/app/libraryapp/test/integration/pages/BooksObjectPage',
		'com/app/libraryapp/test/integration/pages/ActiveLoansObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage, ActiveLoansObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/libraryapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage,
					onTheActiveLoansObjectPage: ActiveLoansObjectPage
                }
            },
            opaJourney.run
        );
    }
);