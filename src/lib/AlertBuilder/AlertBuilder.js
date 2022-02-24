class AlertBuilder {
    constructor(currentRecord, currentUser) {
        this.currentRecord = currentRecord;
        this.currentUser = currentUser;
        this.alerts = {}
    }

    //-- private method
    isUserLoggedIn() {
        return this.currentUser.isLoggedIn
    }
    //-- end of private methods

    //-- global banners for all users even without authentication
    isAwaitingApproval(extraCondition = true) {
        if (!this.currentRecord.fairsharingRecord['isApproved'] && extraCondition) {
            this.alerts['isAwaitingApproval'] = {
                type: "info",
                message: "This record is awaiting review by FAIRsharing curators"
            }
        }
        return this;
    }
    isWatching(isWatching) {
        if (isWatching) {
            this.alerts['isWatching'] = {type: "info", message: "You are watching this record for changes"}
        }
        return this;
    }
    //--end of global banners for all users even without authentication
    //-----------------------------------------------------------------



    //-- banners only for curators and super curators
    isOwnerShipApproved(OwnershipApprovalStatus) {
        if (OwnershipApprovalStatus === 'pending' || !this.isUserLoggedIn() || !OwnershipApprovalStatus) return this;
        this.alerts['isOwnerShipApproved'] = {
            type: "error",
            message: "Your claiming request has been declined. Please get in touch with us if you have any questions."
        }
        if (OwnershipApprovalStatus === 'approved') {
            this.alerts['isOwnerShipApproved'] = {
                type: "success",
                message: "Your request to maintain this record has been approved."
            }
        }
        return this;
    }
    isNeedingReview(needsReviewing = true) {
        if (this.currentUser.is_curator && needsReviewing) {
            this.alerts['isNeedingReview'] = {
                type: "warning",
                message: "This record is awaiting review by FAIRsharing curators"
            }
        }
        return this;
    }
    isNeedingReviewAndBeenReviewed(isReviewPresent = false, needsReviewing = true) {
        if (this.currentUser.is_curator && needsReviewing) {
            this.alerts['isNeedingReview'].message = `This record is in need of periodic curator review. There has not been any review to date.`
            if (isReviewPresent) {
                this.alerts['isNeedingReview'].message = `This record is in need of periodic curator review. The last review was on ${this.currentRecord['fairsharingRecord']['reviews'][0]['createdAt'].split(/T/)[0]}
      by ${this.currentRecord['fairsharingRecord']['reviews'][0]['user']['username']}.`
            }
        }
        return this;
    }
    isAlreadyClaimed(isAlreadyClaimed) {
        if (isAlreadyClaimed) {
            this.alerts['isAlreadyClaimed'] = {
                type: "warning",
                message: "Your ownership request for this record has been submitted. We will get back to you within a few working days."
            }
        }
        return this;
    }
    isHidden() {
        if (this.currentUser.is_curator && this.currentRecord.fairsharingRecord['isHidden']) {
            this.alerts['isHidden'] = {
                type: "warning",
                message: "This record is hidden!"
            }
        }
        return this;
    }
    //--end of banners only for curators and super curators
    //-----------------------------------------------------------------

    // output all collected alerts
    getAlerts() {
        return this.alerts;
    }
}

export default AlertBuilder;