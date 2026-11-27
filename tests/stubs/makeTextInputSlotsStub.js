import { defineComponent, h } from "vue";

export const makeTextInputSlotsStub = (name, tag = "input") =>
  defineComponent({
    name,
    props: {
      modelValue: { type: String, default: "" },
      label: { type: String, default: "" },
    },
    emits: ["update:modelValue"],
    setup(props, { emit, slots }) {
      return () =>
        h("label", [
          slots.prepend?.(),
          props.label,
          h(tag, {
            "aria-label": props.label,
            value: props.modelValue ?? "",
            onInput: (event) => emit("update:modelValue", event.target.value),
          }),
        ]);
    },
  });
