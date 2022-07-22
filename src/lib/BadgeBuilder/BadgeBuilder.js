import infoBadgeData from "@/data/infoBadgeData.json"

class BadgeBuilder {
    constructor(currentRecord) {
        this.currentRecord = currentRecord;
        this.badges = {}
    }

    //----> private functions to create badge object (--> Private method in js starts with (#) <--)
    #createBadgeObject(badgeName, ...props) {
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
                finalBadgeObjectBasedOnLevel = infoBadgeData.standard.level_1
            }

            // check level 2 --- needed in the future... can check different status and generate different badge objects...
            /*if (any condition) {
                finalBadgeObjectBasedOnLevel = infoBadgeData.standard.level_2
            }*/

            // check level 3 and so on...

            // finally, after all level checks, the final overwritten object will be returned...
            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.mergedAssociations) {
            const currentLevelObject = getStandardLevel(this.currentRecord.mergedAssociations);
            this.#createBadgeObject(
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
                finalBadgeObjectBasedOnLevel = infoBadgeData.database.level_1
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.mergedAssociations) {
            const currentLevelObject = getDatabaseLevel(this.currentRecord.mergedAssociations);
            this.#createBadgeObject(
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
                finalBadgeObjectBasedOnLevel = infoBadgeData.policy.level_1
            }
            // write level 2 and so on...

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.mergedAssociations) {
            const currentLevelObject = getPolicyLevel(this.currentRecord.mergedAssociations);
            this.#createBadgeObject("hasPolicy", currentLevelObject)
        }
        return this;
    }

    hasLicence() {
        const getLicenceLevel = (input) => {
            const licencesLength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (licencesLength >= 1) {
                finalBadgeObjectBasedOnLevel = infoBadgeData.licences.level_1
            }
            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.licences) {
            const currentLevelObject = getLicenceLevel(this.currentRecord.licences);
            this.#createBadgeObject(
                "hasLicence",
                currentLevelObject)
        }
        return this;
    }

    hasStatus() {
        const getStatusLevel = (input) => {
            let finalBadgeObjectBasedOnLevel = {}

            // check level 1
            if (input === "ready") {
                finalBadgeObjectBasedOnLevel = infoBadgeData.status.level_1
            }
            // check level 2
            if (input === "in_development") {
                finalBadgeObjectBasedOnLevel = infoBadgeData.status.level_2
            }
            // check level 3
            if (input === "uncertain") {
                finalBadgeObjectBasedOnLevel = infoBadgeData.status.level_3
            }
            // check level 4
            if (input === "deprecated") {
                finalBadgeObjectBasedOnLevel = infoBadgeData.status.level_4
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.status) {
            const currentLevelObject = getStatusLevel(this.currentRecord.status);
            this.#createBadgeObject(
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
                finalBadgeObjectBasedOnLevel = infoBadgeData.maintainer.level_1
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.maintainers) {
            const currentLevelObject = getMaintainerLevel(this.currentRecord.maintainers);
            this.#createBadgeObject(
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
                finalBadgeObjectBasedOnLevel = infoBadgeData.api.level_1
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.metadata.data_processes_and_conditions) {
            const currentLevelObject = getAPILevel(this.currentRecord.metadata.data_processes_and_conditions);
            this.#createBadgeObject(
                "hasAPI",
                currentLevelObject
            )
        }
        return this;
    }

    hasPID() {
        const getPIDLevel = (input) => {
            const PIDLength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            const hasAtLeastOnePID = input.some(item => item.type.toLowerCase() === "identifier_schema");
            // check level 1
            if (PIDLength >= 1 && hasAtLeastOnePID) {
                finalBadgeObjectBasedOnLevel = infoBadgeData.pid.level_1
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.mergedAssociations) {
            const currentLevelObject = getPIDLevel(this.currentRecord.mergedAssociations);
            this.#createBadgeObject(
                "hasPID",
                currentLevelObject
            )
        }
        return this;
    }

    hasCertificate() {
        const getCertificateLevel = (input) => {
            const certificateLength = input.length
            let finalBadgeObjectBasedOnLevel = {}
            // check level 1
            if (certificateLength >= 1) {
                finalBadgeObjectBasedOnLevel = infoBadgeData.certificate.level_1
            }

            return finalBadgeObjectBasedOnLevel
        }
        if (this.currentRecord.metadata.certifications_and_community_badges) {
            const currentLevelObject = getCertificateLevel(this.currentRecord.metadata.certifications_and_community_badges);
            this.#createBadgeObject(
                "hasCertificate",
                currentLevelObject
            )
        }
        return this;
    }

    getBadges() {
        // output all collected badges
        return this.badges;
    }

}

export default BadgeBuilder;

