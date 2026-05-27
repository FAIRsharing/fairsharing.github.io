import { mount, shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import APIDoc from "@/views/Static/APIDoc/APIDoc";

const vuetify = createVuetify();

describe("APIDoc.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(APIDoc, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("APIDoc");
  });

  it("builds the API URLs used in the examples", () => {
    const endpoint = String(wrapper.vm.apiEndpoint || "").replace(/\/$/, "");

    expect(wrapper.vm.loginUrl).toBe(`${endpoint}/users/sign_in`);
    expect(wrapper.vm.recordExampleUrl).toBe(
      `${endpoint}/fairsharing_records/1`,
    );
    expect(wrapper.vm.adhdChinaDatabaseSearchUrl).toBe(
      `${endpoint}/search/fairsharing_records?q=ADHD&fairsharing_registry=database&countries=china`,
    );
    expect(wrapper.vm.chinaDatabaseSearchUrl).toBe(
      `${endpoint}/search/fairsharing_records?fairsharing_registry=database&countries=china&page[number]=1&page[size]=3600`,
    );
    expect(wrapper.vm.apiUrl("relative/path")).toBe(
      `${endpoint}/relative/path`,
    );
    expect(
      APIDoc.methods.apiUrl.call({ apiEndpoint: undefined }, "relative/path"),
    ).toBe("/relative/path");
  });

  it("applies language classes to code examples", async () => {
    const CodeHighlight = APIDoc.components.VueCodeHighlight;
    const codeWrapper = mount(CodeHighlight, {
      props: { language: "ruby" },
      slots: {
        default:
          '<pre class="language-js keep"><code class="language-python also-keep">puts "ok"</code></pre>',
      },
    });

    const pre = codeWrapper.element.querySelector("pre");
    const code = codeWrapper.element.querySelector("code");

    expect(pre.className).toBe("keep language-ruby");
    expect(code.className).toBe("also-keep language-ruby");

    await codeWrapper.setProps({ language: "python" });

    expect(pre.className).toBe("keep language-python");
    expect(code.className).toBe("also-keep language-python");

    codeWrapper.unmount();
  });

  it("does not apply language classes before the code block ref exists", () => {
    const CodeHighlight = APIDoc.components.VueCodeHighlight;

    expect(() =>
      CodeHighlight.methods.applyLanguageClass.call({
        $refs: {},
        language: "ruby",
      }),
    ).not.toThrow();
  });
});
