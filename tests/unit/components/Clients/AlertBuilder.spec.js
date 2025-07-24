import AlertBuilder from "@/lib/AlertBuilder/AlertBuilder";


describe("AlertBuilder", () => {

    let alertBuilder;
    let resp;
    it("can be instantiated alertBuilder", function () {
        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: false, isComplete: true}}
            , {is_curator: true});
        expect(typeof alertBuilder).toBe("object");
    });

    it("can show isAwaitingApproval alert", () => {
      resp = alertBuilder.isAwaitingApproval();
      expect(Object.keys(resp.alerts).length).toBe(1);
      expect(resp.alerts['isAwaitingApproval']['message']).toMatch(/awaiting review/);
      alertBuilder = new AlertBuilder(
        {fairsharingRecord: {isApproved: true}}
        , {is_curator: true});
      resp = alertBuilder.isAwaitingApproval();
      expect(Object.keys(resp.alerts).length).toBe(0);
      alertBuilder = new AlertBuilder(
        {fairsharingRecord: {isApproved: false, isComplete: false}}
        , {is_curator: true});
      resp = alertBuilder.isAwaitingApproval();
      expect(Object.keys(resp.alerts).length).toBe(1);
      expect(resp.alerts['isAwaitingApproval']['message']).toMatch(/all requirements are met/);
    });

    it("can show isWatching alert", () => {
        resp = alertBuilder.isWatching(true);
        expect(Object.keys(resp.alerts).length).toBe(2);
        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: true}}
            , {is_curator: true});
        resp = alertBuilder.isWatching(false);
        expect(Object.keys(resp.alerts).length).toBe(0);
    });

    it("can show isOwnerShipApproved alert", () => {
        resp = alertBuilder.isOwnerShipApproved("pending", true);
        expect(Object.keys(resp.alerts).length).toBe(0);
        resp = alertBuilder.isOwnerShipApproved("OwnershipApprovalStatus", true);
        expect(Object.keys(resp.alerts).length).toBe(1);
        resp = alertBuilder.isOwnerShipApproved("approved", true);
        expect(Object.keys(resp.alerts).length).toBe(1);
        resp = alertBuilder.isOwnerShipApproved("approved");
        expect(Object.keys(resp.alerts).length).toBe(1);
    });

    it("can show isNeedingReview alert", () => {
        resp = alertBuilder.isNeedingReview(true);
        expect(Object.keys(resp.alerts).length).toBe(2);
        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: true}}
            , {is_curator: false});
        resp = alertBuilder.isNeedingReview(true);
        expect(Object.keys(resp.alerts).length).toBe(0);
        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: true}}
            , {is_curator: true});
        resp = alertBuilder.isNeedingReview(false);
        expect(Object.keys(resp.alerts).length).toBe(0);
    });

    it("can show isNeedingReviewAndBeenReviewed alert", () => {
        alertBuilder = new AlertBuilder(
            {
                fairsharingRecord:
                    {
                        isApproved: true,
                        reviews: [{createdAt: "", user: {username: ""}}],
                    }
            }
            , {is_curator: true});
        resp = alertBuilder.isNeedingReview(true);
        resp = alertBuilder.isNeedingReviewAndBeenReviewed();
        expect(Object.keys(resp.alerts).length).toBe(1);
        resp = alertBuilder.isNeedingReviewAndBeenReviewed(true);
        expect(Object.keys(resp.alerts).length).toBe(1);
    });

    it("can show isAlreadyClaimed alert", () => {
        resp = alertBuilder.isAlreadyClaimed(true);
        expect(Object.keys(resp.alerts).length).toBe(2);
        resp = alertBuilder.isAlreadyClaimed(false);
        expect(Object.keys(resp.alerts).length).toBe(2);
    });

    it("can collect alert", () => {
        resp = alertBuilder.getAlerts()
        expect(Object.keys(resp).length).toBe(2);
    });

    it("can show isHidden alert", () => {
        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: true, isHidden: true}}
            , {is_curator: true});
        resp = alertBuilder.isHidden();
        expect(Object.keys(resp.alerts).length).toBe(1);

        alertBuilder = new AlertBuilder(
            {fairsharingRecord: {isApproved: true, isHidden: false}}
            , {is_curator: true});
        resp = alertBuilder.isHidden();
        expect(Object.keys(resp.alerts).length).toBe(0);
    });


});
