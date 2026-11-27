import { defineComponent, h } from "vue";

export const makeTextInputStub = (name, tag = "input") =>
  defineComponent({
    name,
    props: {
      modelValue: {
        // Preserve unrestricted legacy v-model values.
        type: null,
        default: null,
      },
    },

    emits: ["update:modelValue"],

    setup(props, { emit, attrs }) {
      return () =>
        h(tag, {
          ...attrs,

          "data-test": name.toLowerCase(),

          value: props.modelValue ?? "",

          onInput: (event) => {
            emit("update:modelValue", event.target.value);
          },
        });
    },
  });
