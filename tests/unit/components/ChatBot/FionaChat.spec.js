import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {mount} from "@vue/test-utils";
import {nextTick} from "vue";

import FionaChat from "@/components/ChatBot/FionaChat.vue";

describe("FionaChat", () => {
  let wrapper;

  beforeEach(() => {
    vi.stubEnv("VITE_FIONA_CHAT_ID", "test-chat-id");
    document.body.innerHTML = '<div id="app"></div>';
    wrapper = mount(FionaChat, {
      attachTo: "#app",
    });
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
    vi.unstubAllEnvs();
  });

  it("shows the chat button", () => {
    const button = document.querySelector(".fairsharing-chat__button");

    expect(button).not.toBeNull();
    expect(button.getAttribute("aria-label")).toBe("Open chat");
  });

  it("opens the chat window when clicked", async () => {
    const button = document.querySelector(".fairsharing-chat__button");

    button.click();
    await nextTick();

    expect(document.querySelector("#fairsharing-chat-window")).not.toBeNull();

    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("closes the chat window when the close button is clicked", async () => {
    document.querySelector(".fairsharing-chat__button").click();
    await nextTick();

    document.querySelector(".fairsharing-chat__close").click();
    await nextTick();

    expect(document.querySelector("#fairsharing-chat-window")).toBeNull();

    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("closes the chat window when Escape is pressed", async () => {
    document.querySelector(".fairsharing-chat__button").click();
    await nextTick();

    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
      }),
    );

    await nextTick();

    expect(wrapper.vm.isOpen).toBe(false);
  });
});
