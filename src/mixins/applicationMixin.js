export const applicationMixin = {
    data: function () {
        return {
            applicationStrings: {
                connectionErrors: {
                    NOT_FOUND: 'The record you are looking for does not exist.',
                    CONNECTION_ERROR: 'There is a connection issue',
                    NO_INTERNET: 'Your internet connection has been lost',
                },
                mainTopNav: {
                    TITLE_1: 'Standard',
                    TITLE_2: 'Policy',
                    TITLE_3: 'Collection',
                    TITLE_4: 'Search',
                }
            },
            get globalReadOnlyProperty() {
                return "Can't touch this!";
            },
        }
    }
};