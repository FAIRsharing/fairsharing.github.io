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
        },
        getRecordLink(record) {
            if (record.doi) {
                // Only the last part of the DOI is needed for local links.
                return record.doi.split('/').pop();
            } else {
                return record.id;
            }
        }
    },
}

export default recordsCardUtils;

