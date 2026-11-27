import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import infoBadge from "@/components/Records/Record/GeneralInfo/Badge/InfoBadge.vue";
import infoBadgeData from "@/data/infoBadgeData.json";
import { VTooltipStub } from "../../../../../../stubs/index.js";

const vuetify = createVuetify();
const initialRecord = {
  fairsharingRecord: {
    name: "standard",
    recordAssociations: [
      {
        linkedRecord: {
          id: 1,
          name: "a name",
          registry: "Standard",
          type: "terminology_artifact",
        },
        recordAssocLabel: "implements",
      },
      {
        linkedRecord: {
          id: 3,
          name: "a name 3",
          registry: "Database",
          type: "journal",
        },
        recordAssocLabel: "related to",
      },
      {
        linkedRecord: {
          id: 3,
          name: "a name 3",
          registry: "Database",
          type: "journal",
        },
        recordAssocLabel: "related to",
      },
      {
        linkedRecord: {
          id: 4,
          name: "a name 4",
          registry: "Collection",
          type: "collection",
        },
        recordAssocLabel: "collects",
      },
    ],
    reverseRecordAssociations: [
      {
        fairsharingRecord: {
          id: 2,
          name: "b name",
          registry: "Policy",
          type: "repository",
        },
        recordAssocLabel: "related to",
      },
    ],
    metadata: { access_points: {} },
    registry: "Standard",
  },
};

describe("infoBadge.vue", function () {
  let wrapper;
  let record;

  beforeEach(async () => {
    record = structuredClone(initialRecord);
    wrapper = shallowMount(infoBadge, {
      vuetify,
      props: { currentRecord: record },
      stubs: { VTooltip: VTooltipStub },
    });
    await wrapper.vm.$nextTick();
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("InfoBadge");
  });

  it("merges incoming and outgoing associations before building related-record badges", () => {
    const merged =
      wrapper.vm.currentRecordLocal.fairsharingRecord.mergedAssociations;
    expect(merged).toHaveLength(5);
    expect(merged[0]).toMatchObject({
      id: 1,
      registry: "Standard",
      linkType: "linkedRecord",
      subject: "standard",
      recordAssocLabel: ["implements"],
    });
    expect(merged[4]).toMatchObject({
      id: 2,
      registry: "Policy",
      linkType: "fairsharingRecord",
      subject: "standard",
    });
    expect(wrapper.vm.badges).toEqual({
      hasStandard: infoBadgeData.standard.level_1,
      hasDatabase: infoBadgeData.database.level_1,
      hasPolicy: infoBadgeData.policy.level_1,
    });
    expect(wrapper.findAll(".extra-badge-holder")).toHaveLength(3);
    const progress = wrapper.findAllComponents({ name: "VProgressCircular" });
    expect(progress).toHaveLength(3);
    expect(progress.map((circle) => circle.props("modelValue"))).toEqual([
      "100",
      "100",
      "100",
    ]);
    expect(wrapper.findAll("b").map((label) => label.text())).toEqual([
      "100",
      "100",
      "100",
    ]);
  });

  it("renders every supported badge and delegates status display to RecordStatus", async () => {
    const current = wrapper.vm.currentRecordLocal.fairsharingRecord;
    Object.assign(current, {
      status: "ready",
      licences: [{ id: 1 }],
      maintainers: [{ id: 1 }],
      metadata: {
        data_processes_and_conditions: [{ type: "read" }],
        certifications_and_community_badges: ["Certified"],
      },
    });
    current.recordAssociations.push({
      linkedRecord: {
        id: 8,
        name: "PID scheme",
        registry: "Standard",
        type: "identifier_schema",
      },
      recordAssocLabel: "uses",
    });
    current.mergedAssociations = wrapper.vm.mergedAssociations();
    wrapper.vm.checkBadges();
    await wrapper.vm.$nextTick();
    expect(Object.keys(wrapper.vm.badges)).toEqual([
      "hasStatus",
      "hasLicence",
      "hasMaintainer",
      "hasStandard",
      "hasDatabase",
      "hasPolicy",
      "hasAPI",
      "hasPID",
      "hasCertificate",
    ]);
    expect(
      wrapper.findAllComponents({ name: "VProgressCircular" }),
    ).toHaveLength(9);
    const status = wrapper.findComponent({ name: "RecordStatus" });
    expect(status.props("record")).toBe(current);
    expect(status.props("showOnlyStatus")).toBe(true);
    expect(wrapper.findAll(".extra-badge-holder")).toHaveLength(3);
    for (const badge of Object.values(wrapper.vm.badges).filter(
      (badge) => badge.icon,
    )) {
      expect(
        wrapper
          .findAllComponents({ name: "Icon" })
          .some((icon) => icon.props("item") === badge.icon),
      ).toBe(true);
      expect(wrapper.text()).toContain(badge.textHover);
    }
  });

  it("controls progress labels and hover tooltips through props", async () => {
    expect(wrapper.findAll(".circle-transparent")).toHaveLength(0);
    await wrapper.setProps({
      showProgressHover: true,
      showTextHover: false,
      showProgress: false,
    });
    expect(wrapper.findAll("b")).toHaveLength(0);
    expect(wrapper.findAll(".circle-transparent")).toHaveLength(3);
    const tooltips = wrapper.findAllComponents(VTooltipStub);
    expect(
      tooltips
        .filter((tooltip) => tooltip.attributes("location") === "bottom")
        .every((tooltip) => tooltip.attributes("open-on-hover") === "true"),
    ).toBe(true);
    expect(
      tooltips
        .filter((tooltip) => tooltip.attributes("location") === "top")
        .every((tooltip) => tooltip.attributes("open-on-hover") === "false"),
    ).toBe(true);
    for (const badge of Object.values(wrapper.vm.badges))
      expect(wrapper.text()).toContain(badge.progressHover);
    await wrapper.setProps({ showProgress: true });
    expect(wrapper.findAll("b")).toHaveLength(3);
  });

  it("clears rendered badges when the record no longer meets their criteria", async () => {
    const current = wrapper.vm.currentRecordLocal.fairsharingRecord;
    current.recordAssociations = [];
    current.reverseRecordAssociations = [];
    current.mergedAssociations = wrapper.vm.mergedAssociations();
    wrapper.vm.checkBadges();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.badges).toEqual({});
    expect(
      wrapper.findAllComponents({ name: "VProgressCircular" }),
    ).toHaveLength(0);
    expect(wrapper.findAllComponents({ name: "Icon" })).toHaveLength(0);
  });
});
