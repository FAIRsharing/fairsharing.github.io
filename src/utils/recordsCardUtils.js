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
            else if(chip.type==='objectTypes') {
              return 'object_type_color';
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
            let link_records ={
                standard: [],
                database: [],
                policy: []
            }
            let type
            records['registry'] = record.registry.toLowerCase()
            record['recordAssociations'].forEach(function (association) {
                type = association['linkedRecord'].registry.toLowerCase()
                /* istanbul ignore else */
                if (type !== 'collection') {
                    /* istanbul ignore else */
                    if (!link_records[type].includes(association['linkedRecord'].id)){
                        link_records[type].push(association['linkedRecord'].id)
                        records['registryNumber'][type].val += 1
                    }
                }
            });
            record['reverseRecordAssociations'].forEach(function (association) {
                type =  association['fairsharingRecord'].registry.toLowerCase()
                /* istanbul ignore else */
                if (type !== 'collection') {
                    /* istanbul ignore else */
                    if (!link_records[type].includes(association['fairsharingRecord'].id)){
                        link_records[type].push(association['fairsharingRecord'].id)
                        records['registryNumber'][type].val += 1
                    }
                }
            });
            return records;
        },
        setChips(record) {
            const _module = this;
            const order = ['objectTypes', 'subjects', 'domains', 'taxonomies']
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
            /* istanbul ignore else */
            if (record[node]) {
                record[node].forEach(function (item, index) {
                    /* istanbul ignore else */
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
        },
        truncateString(str, num) {
            if (str === null || str.trim() === "") {
                return str;
            }
            if (str.length > num) {
                return str.slice(0, num) + "...";
            } else {
                return str;
            }
        }
    },
}

export default recordsCardUtils;

