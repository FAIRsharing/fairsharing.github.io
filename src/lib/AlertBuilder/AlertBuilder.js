class AlertBuilder {
    constructor(currentRecord, currentUser) {
        this.currentRecord = currentRecord;
        this.currentUser = currentUser;
        this.alerts = {}
    }

    //-- global banners for all users even without authentication
    isAwaitingApproval() {
        if (!this.currentRecord.fairsharingRecord['isApproved']) {
            this.alerts['isAwaitingApproval'] = {
                type: "info",
                message: "This record is awaiting review by FAIRsharing curators"
            }
        }
        return this;
    }

    //--end of global banners for all users even without authentication
    //-----------------------------------------------------------------


    //-- banners only for curators and super curators

    isWatching(isWatching) {
        if (isWatching) {
            this.alerts['isWatching'] = {type: "info", message: "You are watching this record for changes"}
        }
        return this;
    }

    isOwnerShipApproved(OwnershipApprovalStatus, isAlertExpired = false) {
        if (OwnershipApprovalStatus === 'pending' || !OwnershipApprovalStatus || !isAlertExpired) return this;
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

    isNeedingReview(needsReviewing) {
        console.log(this.currentUser.is_curator && needsReviewing)
        if (this.currentUser.is_curator && needsReviewing) {
            this.alerts['isNeedingReview'] = {
                type: "warning",
                message: "This record is in need of periodic curator review.There has not been any review to date."
            }
        }
        return this;
    }

    isNeedingReviewAndBeenReviewed(isReviewPresent = false) {
        if (this.currentUser.is_curator && isReviewPresent && this.alerts.isNeedingReview) {
            this.alerts['isNeedingReview'].message = `This record is in need of periodic curator review. The last review was on ${this.currentRecord['fairsharingRecord']['reviews'][0]['createdAt'].split(/T/)[0]}
      by ${this.currentRecord['fairsharingRecord']['reviews'][0]['user']['username']}.`
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