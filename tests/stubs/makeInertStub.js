import { defineComponent, h } from "vue";

export const makeInertStub = (name) =>
  defineComponent({
    name,
    inheritAttrs: false,

    setup(_, { slots }) {
      return () =>
        h(
          "div",
          {
            "data-test": name.toLowerCase(),
          },
          slots.default?.() || [],
        );
    },
  });
