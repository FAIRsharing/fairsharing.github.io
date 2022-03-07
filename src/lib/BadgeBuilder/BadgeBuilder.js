class BadgeBuilder {
    constructor(currentRecord) {
        this.currentRecord = currentRecord;
        this.badges = {}
    }

    //----> private functions to create badge object
    createBadgeObject(badgeName, ...props) {
        if (Object.keys(...props).length !== 0) {
            this.badges[badgeName] = {}
            Object.keys(...props).forEach(key => {
                this.badges[badgeName][key] = props[0][key]
            })
        }
    }
    //----> end of private functions

    // hasStandard function is commented with all information for the extending this class
    hasStandard() {
        // define internal criteria rules to generate proper object for badge... (encapsulating logic here in its function)
        const getStandardLevel = (input) => {
            const standardsLength = input.length
            let finalBadgeObjectBasedOnLevel = {}

            // please place the order of level checks from low to high: for example, first check with the lowest condition like if (length<1) then check(length<2) and so on...
            // starting level checking sequentially...

            const hasAtLeastOneStandard = input.some(item => item.registry.toLowerCase() === "standard");
            // check level 1
            if (standardsLength >= 1 && hasAtLeastOneStandard) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for standard",
                    progressHover: "This is hover text for standard"
                }
            }

            // check level 2 --- needed in the future... can check different status and generate different badge objects...
            /*if (any condition) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "red",
                    progress: 20,
                    icon: "icon",
                    textHover: "This is hover text for standard",
                    progressHover: "This is hover text for this conditon"
                }
            }*/

            // check level 3 and so on...

            // finally, after all level checks, the final overwritten object will be returned...
            return finalBadgeObjectBasedOnLevel
        }

        if (this.currentRecord.mergedAssociations && this.currentRecord.mergedAssociations.length) {
            const currentLevelObject = getStandardLevel(this.currentRecord.mergedAssociations);
            this.createBadgeObject(
                "hasStandard",
                currentLevelObject)
        }
        return this;
    }

    hasDatabase() {
        const getDatabaseLevel = (input) => {
            const databasesLength = input.length
            let finalBadgeObjectBasedOnLevel = {}

            const hasAtLeastOneDatabase = input.some(item => item.registry.toLowerCase() === "database");
            // check level 1
            if (databasesLength >= 1 && hasAtLeastOneDatabase) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for database",
                    progressHover: "This is hover text for database"
                }
            }

            return finalBadgeObjectBasedOnLevel
        }

        if (this.currentRecord.mergedAssociations && this.currentRecord.mergedAssociations.length) {
            const currentLevelObject = getDatabaseLevel(this.currentRecord.mergedAssociations);
            this.createBadgeObject(
                "hasDatabase",
                currentLevelObject)
        }
        return this;
    }

    hasPolicy() {
        const getPolicyLevel = (input) => {
            const policiesLength = input.length
            let finalBadgeObjectBasedOnLevel = {};
            const hasAtLeastOnePolicy = input.some(item => item.registry.toLowerCase() === "policy");
            // check level 1
            if (policiesLength >= 1 && hasAtLeastOnePolicy) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for policy",
                    progressHover: "This is hover text for policy"
                }
            }
            // write level 2 and so on...

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.mergedAssociations && this.currentRecord.mergedAssociations.length) {
            const currentLevelObject = getPolicyLevel(this.currentRecord.mergedAssociations);
            this.createBadgeObject("hasPolicy", currentLevelObject)
        }
        return this;
    }

    hasLicence() {
        const getLicenceLevel = (input) => {
            const licencesLength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (licencesLength >= 1) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for licence",
                    progressHover: "This is hover text for licence"
                }
            }
            return finalBadgeObjectBasedOnLevel
        }

        if (this.currentRecord.licences && this.currentRecord.licences.length) {
            const currentLevelObject = getLicenceLevel(this.currentRecord.licences);
            this.createBadgeObject(
                "hasLicence",
                currentLevelObject)
        }
        return this;
    }

    hasStatus() {
        const getStatusLevel = (input) => {
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (input) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 100,
                    progressHover: "This is hover text for ready status"
                }
            }

            // possible checks in the future
            /*
                        if (input === "ready") {
                            finalBadgeObjectBasedOnLevel = {
                                progressColor: "green",
                                progress: 100,
                                icon: "icon",
                                progressHover: "This is hover text for ready status"
                            }
                        }
            */

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.status) {
            const currentLevelObject = getStatusLevel(this.currentRecord.status);
            this.createBadgeObject(
                "hasStatus",
                currentLevelObject)
        }
        return this;
    }

    hasMaintainer() {
        const getMaintainerLevel = (input) => {
            const maintainersLength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (maintainersLength >= 1) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for maintenance",
                    progressHover: "This is hover text for maintenance"
                }
            }

            return finalBadgeObjectBasedOnLevel
        }

        if (this.currentRecord.maintainers && this.currentRecord.maintainers.length) {
            const currentLevelObject = getMaintainerLevel(this.currentRecord.maintainers);
            this.createBadgeObject(
                "hasMaintainer",
                currentLevelObject
            )
        }
        return this;
    }

    hasAPI() {
        const getAPILevel = (input) => {
            const APILength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (APILength >= 1) {
                finalBadgeObjectBasedOnLevel = {
                    progressColor: "gray",
                    progress: 0,
                    icon: "icon",
                    textHover: "This is hover text for API",
                    progressHover: "This is hover text for API"
                }
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.metadata.access_points && this.currentRecord.metadata.access_points.length) {
            const currentLevelObject = getAPILevel(this.currentRecord.metadata.access_points);
            this.createBadgeObject(
                "hasAPI",
                currentLevelObject
            )
        }

        return this;
    }

    hasPID() {
        return this;
    }

    hasCertificate() {
        return this;
    }

    getBadges() {
        // output all collected badges
        return this.badges;
    }

//   todo - hasPolicy, hasAPI, hasPID, hasCertificate
}

export default BadgeBuilder;

