import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import FionaChat from "@/components/ChatBot/FionaChat.vue";

describe("FionaChat", () => {
  let wrapper;

  beforeEach(() => {
    vi.stubEnv("VITE_FIONA_CHAT_ID", "test-chat-id");
    document.body.innerHTML = '<div id="app"></div>';
    wrapper = mount(FionaChat, {
      attachTo: "#app",
      data: () => ({
        chatUrl: "about:blank#",
      }),
      global: {
        stubs: {
          VBtn: {
            template:
              '<button class="v-btn-stub" v-bind="$attrs"><slot /></button>',
          },
          Transition: false,
          Teleport: true,
        },
      },
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

  it("can check toggleChat method", async () => {
    wrapper.vm.isOpen = true;

    wrapper.vm.toggleChat();
    wrapper.vm.isOpen = false;

    expect(wrapper.vm.isMaximized).toBe(false);
  });

  describe("toggleMaximize", () => {
    it("can check toggleMaximize method", async () => {
      wrapper.vm.isMaximized = true;
      wrapper.vm.toggleMaximize();
      expect(wrapper.vm.isMaximized).toBe(false);
    });

    it("toggles maximize button when clicked", async () => {
      // Open chat window
      document.querySelector(".fairsharing-chat__button").click();
      await nextTick();

      // Maximize chat window
      document.querySelector('[aria-label="Maximize chat window"]').click();
      await nextTick();

      expect(wrapper.vm.isMaximized).toBe(true);
      expect(
        document.querySelector(".fairsharing-chat__window--maximized"),
      ).not.toBeNull();
    });
  });

  describe("handleKeydown", () => {
    it("does nothing when a key other than Escape is pressed", () => {
      wrapper.vm.isOpen = true;
      wrapper.vm.isMaximized = true;

      const event = new KeyboardEvent("keydown", {
        key: "Enter",
      });

      const result = wrapper.vm.handleKeydown(event);

      expect(result).toBe(true);
      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.isMaximized).toBe(true);
    });

    it("restores the chat when Escape is pressed while maximized", () => {
      wrapper.vm.isOpen = true;
      wrapper.vm.isMaximized = true;

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
      });

      const result = wrapper.vm.handleKeydown(event);

      expect(result).toBe(true);
      expect(wrapper.vm.isMaximized).toBe(false);
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("closes the chat when Escape is pressed while not maximized", () => {
      wrapper.vm.isOpen = true;
      wrapper.vm.isMaximized = false;

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
      });

      const result = wrapper.vm.handleKeydown(event);

      expect(result).toBe(true);
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.isMaximized).toBe(false);
    });
  });
});
