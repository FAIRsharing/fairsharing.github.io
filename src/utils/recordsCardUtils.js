const recordsCardUtils = {
    methods: {
        getRecordLink(record) {
            if (record.doi) {
                // Only the last part of the DOI is needed for local links.
                return record.doi.split('/').pop();
            } else {
                return record.id;
            }
        },
        getChipColor(chip){
            if(chip.type==='subjects'){
                return 'subject_color';
            }
            else if(chip.type==='domains')
            {
                return 'domain_color';
            }
            else if(chip.type==='taxonomies')
            {
                return 'taxonomic_color';
            }
        }
    },
}

export default recordsCardUtils;

