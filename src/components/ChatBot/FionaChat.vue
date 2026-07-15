<template>
  <Teleport to="body">
    <div class="fairsharing-chat">
      <Transition name="chat-window">
        <section
          v-if="isOpen"
          id="fairsharing-chat-window"
          aria-label="FAIRsharing assistant"
          class="fairsharing-chat__window"
          role="dialog"
        >
          <header class="fairsharing-chat__header">
            <span>FAIRsharing Assistant</span>

            <button
              aria-label="Close chat"
              class="fairsharing-chat__close"
              type="button"
              @click="closeChat"
            >
              &times;
            </button>
          </header>

          <iframe
            :src="chatUrl + chatId"
            allow="clipboard-read; clipboard-write"
            class="fairsharing-chat__iframe"
            loading="lazy"
            title="FAIRsharing Assistant"
          />
        </section>
      </Transition>

      <button
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Close chat' : 'Open chat'"
        aria-controls="fairsharing-chat-window"
        class="fairsharing-chat__button"
        type="button"
        @click="toggleChat"
      >
        <svg v-if="!isOpen" aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 5h12V7H6v2Zm0 4h8v-2H6v2Z"
          />
        </svg>

        <span v-else aria-hidden="true">&times;</span>
      </button>
    </div>
  </Teleport>
</template>
<script>
export default {
  name: "FionaChat.vue",
  data: () => {
    return {
      isOpen: false,
      chatUrl: "https://aicc.uksouth.cloudapp.azure.com/chat/",
      chatId: import.meta.env.VITE_FIONA_CHAT_ID,
    };
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    closeChat() {
      this.isOpen = false;
    },
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closeChat();
      }
    },
  },
};
</script>

<style scoped>
.fairsharing-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10000;
}

.fairsharing-chat__button {
  display: flex;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: #186f65;
  color: white;
  box-shadow: 0 8px 25px rgb(0 0 0 / 25%);
  cursor: pointer;
}

.fairsharing-chat__button:hover {
  filter: brightness(1.08);
}

.fairsharing-chat__button:focus-visible,
.fairsharing-chat__close:focus-visible {
  outline: 3px solid #f5c542;
  outline-offset: 3px;
}

.fairsharing-chat__button svg {
  width: 30px;
  height: 30px;
  fill: currentColor;
}

.fairsharing-chat__button span {
  font-size: 36px;
  line-height: 1;
}

.fairsharing-chat__window {
  position: absolute;
  right: 0;
  bottom: 76px;
  display: flex;
  width: min(400px, calc(100vw - 32px));
  height: min(650px, calc(100vh - 130px));
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: white;
  box-shadow: 0 12px 40px rgb(0 0 0 / 30%);
}

.fairsharing-chat__header {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #186f65;
  color: white;
  font-weight: 600;
}

.fairsharing-chat__close {
  border: 0;
  background: transparent;
  color: white;
  font-size: 28px;
  cursor: pointer;
}

.fairsharing-chat__iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: white;
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 600px) {
  .fairsharing-chat {
    right: 16px;
    bottom: 16px;
  }

  .fairsharing-chat__window {
    position: fixed;
    inset: 12px 12px 88px;
    width: auto;
    height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-window-enter-active,
  .chat-window-leave-active {
    transition: none;
  }
}
</style>
