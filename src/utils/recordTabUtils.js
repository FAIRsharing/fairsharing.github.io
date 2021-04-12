const recordTabUtils = {
    computed: {
        /** Fetch content related to each tab and feed search autocomplete*/
        getValues() {
            let selectedTabKey = Object.keys(this.tabsData.tabs)
            return this.tabsData.tabs[selectedTabKey[this.tabsData.selectedTab]].data;
        },
        /** Deactivate the section if none of the tabs hold data*/
        tabsDataExist() {
            let inactiveTabs = true
            for (const [key] of Object.entries(this.filterList)) {
                if (this.filterList[key].data.length >= 1) {
                    inactiveTabs = false
                    break
                }
            }
            return inactiveTabs
        },
        /** Filter down list if search box value changes unless it returns the whole data in a list*/
        filterList() {
            const _module = this
            // here I deep copied object so the references are gone and my object is a new object with unique reference
            const output = JSON.parse(JSON.stringify(_module.tabsData.tabs));

            if (this.selectedValues !== null && this.selectedValues !== "" && this.selectedValues !== undefined) {
                let foundItem = output[Object.keys(_module.tabsData.tabs)[_module.tabsData.selectedTab]].data.find(item => item.name === _module.selectedValues)
                if (foundItem) {
                    output[Object.keys(output)[_module.tabsData.selectedTab]].data = []
                    output[Object.keys(output)[_module.tabsData.selectedTab]].data.push(foundItem)
                }
                return output
            }
            return output
        }
    },
    methods: {
        /** Combines associations and reserveAssociations into a single array and prepare the data for the search table */
        prepareAssociations(associations, reverseAssociations) {
            let _module = this;
            let recordAssociations = []
            let joinedArrays = associations.concat(reverseAssociations);
            const properties = ['fairsharingRecord', 'linkedRecord'];

            joinedArrays.forEach(item => {
                let object = {};
                properties.forEach(prop => {
                    if (Object.prototype.hasOwnProperty.call(item, prop)) {
                        object.recordAssocLabel = _module.cleanString(item.recordAssocLabel);
                        object.id = item[prop].id;
                        object.registry = item[prop].registry;
                        object.name = item[prop].name;
                        object.subject = _module.currentRecord['fairsharingRecord'].name;
                        object.type = item[prop].type;
                    }
                });
                recordAssociations.push(object);
            });
            return recordAssociations;
        },
        /** active the very first tab that contains at least one item */
        getFirstActiveTab() {
            let firstActiveTabIndex = 0;
            let index = -1
            for (const [key] of Object.entries(this.filterList)) {
                index++
                if (this.filterList[key].data.length >= 1) {
                    firstActiveTabIndex = index
                    break
                }
            }
            this.tabsData.selectedTab = firstActiveTabIndex
        }
    },
    beforeMount() {
        this.prepareTabsData();
        this.getFirstActiveTab();
    }
}

export default recordTabUtils;

