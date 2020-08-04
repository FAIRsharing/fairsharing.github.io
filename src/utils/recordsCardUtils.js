const recordsCardUtils = {
    methods: {
        getButtonLabel(ItemTitle) {
            let returnedTitle;
            returnedTitle = ItemTitle;
            switch (ItemTitle) {
                case 'taxonomies':
                    returnedTitle = 'species';
                    break;
                case 'userDefinedTags':
                    returnedTitle = 'tags';
                    break;
                default:
                    returnedTitle = ItemTitle;
                    break;
            }
            return returnedTitle;
        }
    },
}

export default recordsCardUtils;
