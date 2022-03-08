import BadgeBuilder from "@/lib/BadgeBuilder/BadgeBuilder";
import badgeBuilderFakeData from "@/../tests/fixtures/badgeBuilderFakeData.json"

describe("BadgeBuilder", () => {

    let badgeBuilder;
    let resp;
    it("can be instantiated badgeBuilder", function () {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        expect(typeof badgeBuilder).toBe("object");
    });

    it("can show hasStandard badge", () => {
        resp = badgeBuilder.hasStandard();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.mergedAssociations
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStandard();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.mergedAssociations = changedData.mergedAssociations.filter(item => item.registry.toLowerCase() !== "standard")
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStandard();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasDatabase badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasDatabase();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.mergedAssociations
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasDatabase();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.mergedAssociations = changedData.mergedAssociations.filter(item => item.registry.toLowerCase() !== "database")
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasDatabase();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasPolicy badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasPolicy();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.mergedAssociations
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasPolicy();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.mergedAssociations = changedData.mergedAssociations.filter(item => item.registry.toLowerCase() !== "policy")
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasPolicy();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasLicence badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasLicence();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.licences
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasLicence();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.licences = []
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasLicence();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasStatus badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasStatus();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.status
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStatus();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.status = "in_development"
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStatus();
        expect(Object.keys(resp.badges).length).toBe(1);
        changedData.status = "uncertain"
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStatus();
        expect(Object.keys(resp.badges).length).toBe(1);
        changedData.status = "deprecated"
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasStatus();
        expect(Object.keys(resp.badges).length).toBe(1);
    });


    it("can show hasMaintainer badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasMaintainer();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.maintainers
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasMaintainer();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.maintainers = []
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasMaintainer();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasAPI badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasAPI();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.metadata.access_points
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasAPI();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.metadata.access_points = []
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasAPI();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasPID badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasPID();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.mergedAssociations
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasPID();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.mergedAssociations = changedData.mergedAssociations.filter(item => item.type.toLowerCase() !== "identifier_schema")
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasPID();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can show hasCertificate badge", () => {
        badgeBuilder = new BadgeBuilder(badgeBuilderFakeData);
        resp = badgeBuilder.hasCertificate();
        expect(Object.keys(resp.badges).length).toBe(1);
        let changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        delete changedData.metadata.certifications_and_community_badges
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasCertificate();
        expect(Object.keys(resp.badges).length).toBe(0);
        changedData = JSON.parse(JSON.stringify(badgeBuilderFakeData))
        changedData.metadata.certifications_and_community_badges = []
        badgeBuilder = new BadgeBuilder(changedData);
        resp = badgeBuilder.hasCertificate();
        expect(Object.keys(resp.badges).length).toBe(0);
    });

    it("can collect badges", () => {
        resp = badgeBuilder.getBadges()
        expect(Object.keys(resp).length).toBe(0);
    });

});
