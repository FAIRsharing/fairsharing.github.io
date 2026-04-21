import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import infoBadge from "@/components/Records/Record/GeneralInfo/Badge/InfoBadge.vue";

const vuetify = createVuetify();

describe("infoBadge.vue", function () {
  let wrapper;

  it("can be instantiated", async () => {
    wrapper = await shallowMount(infoBadge, {
      vuetify,
      props: {
        currentRecord: {
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
                linkedRecord: {
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
        },
      },
    });
    expect(wrapper.vm.$options.name).toMatch("InfoBadge");
  });
});
