const recordsCardUtils = {
    methods: {
        getRecordLink(record) {
            if (record.doi) {
                // Only the last part of the DOI is needed for local links.
                return record.doi.split('/').pop();
            }
            else {
                return record.id;
            }
        },
        getChipColor(chip){
            if(chip.type==='subjects'){
                return 'subject_color';
            }
            else if(chip.type==='domains') {
                return 'domain_color';
            }
            else if(chip.type==='taxonomies') {
                return 'taxonomic_color';
            }
            else if(chip.type==='userDefinedTags') {
                return 'tags_color';
            }
        },
        capitaliseText(text, type) {
            if (type === 'taxonomy') {
                // Upper case for first character only.
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            }
            else {
                // Upper case for first letter of each word.
                return text.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
            }
        },
        associatedRecords(record) {
            let records = {
                registryNumber: {
                    standard: {
                        val: 0,
                        label: "standards"
                    },
                    database: {
                        val: 0,
                        label: "databases"
                    },
                    policy: {
                        val: 0,
                        label: "policies"
                    },
                },
                registry: null
            };
            records['registry'] = record.registry.toLowerCase()
            record['recordAssociations'].forEach(function (association) {
                if (association['linkedRecord'].registry.toLowerCase() !== 'collection') {
                    records['registryNumber'][association['linkedRecord'].registry.toLowerCase()].val += 1
                }
            });
            record['reverseRecordAssociations'].forEach(function (association) {
                if (association['fairsharingRecord'].registry.toLowerCase() !== 'collection') {
                    records['registryNumber'][association['fairsharingRecord'].registry.toLowerCase()].val += 1
                }
            });
            return records;
        },
        setChips(record) {
            const _module = this;
            const order = ['subjects', 'domains', 'taxonomies']
            _module.remainTagCount = 0
            _module.chips = [];
            order.forEach(node => {
                record[node].remainTagCount = 0
                _module.organizeChips(record, node, _module.getMaxItemShown);
            });
            for (let i = 0; i < order.length; i++) {
                _module.remainTagCount += record[order[i]].remainTagCount
            }
        },
        organizeChips(record, node, max_item_shown) {
            const _module = this;
            if (record[node]) {
                record[node].forEach(function (item, index) {
                    if (index < max_item_shown) {
                        item.type = node;
                        _module.chips.push(item);
                    }
                    else {
                        record[node].remainTagCount++;
                    }
                });
                return true;
            }
            else {
                return false;
            }
        }
    },
}

export default recordsCardUtils;

