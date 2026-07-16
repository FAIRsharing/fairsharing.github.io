<template>
  <Teleport to="body">
    <div class="fairsharing-chat">
      <Transition name="chat-window">
        <section
            v-if="isOpen"
            id="fairsharing-chat-window"
            :class="[
            'fairsharing-chat__window',
            {
              'fairsharing-chat__window--maximized': isMaximized,
            },
          ]"
            aria-label="FAIRsharing assistant"
            role="dialog"
        >
          <header class="fairsharing-chat__header">
            <span>FAIRsharing Assistant</span>

            <div class="fairsharing-chat__header-actions">
              <button
                  :aria-label="
                  isMaximized ? 'Restore chat window' : 'Maximize chat window'
                "
                  class="fairsharing-chat__header-button"
                  type="button"
                  @click="toggleMaximize"
              >
                <svg v-if="!isMaximized" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                      d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2v12h12V6H6Z"
                  />
                </svg>

                <svg v-else aria-hidden="true" viewBox="0 0 24 24">
                  <path
                      d="M8 4h11a1 1 0 0 1 1 1v11h-2V6H8V4Zm-3 4h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm1 2v8h9v-8H6Z"
                  />
                </svg>
              </button>

              <button
                  aria-label="Close chat"
                  class="fairsharing-chat__header-button fairsharing-chat__close"
                  type="button"
                  @click="closeChat"
              >
                &times;
              </button>
            </div>
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

      <v-btn
          :aria-expanded="isOpen"
          :aria-label="isOpen ? 'Close chat' : 'Open chat'"
          aria-controls="fairsharing-chat-window"
          class="fairsharing-chat__button"
          icon
          @click="toggleChat"
      >
        <svg v-if="!isOpen" aria-hidden="true" viewBox="0 0 24 24">
          <path
              d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 5h12V7H6v2Zm0 4h8v-2H6v2Z"
          />
        </svg>

        <span v-else aria-hidden="true">&times;</span>
      </v-btn>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "FionaChat",

  data() {
    return {
      isOpen: false,
      isMaximized: false,
      chatUrl: "https://aicc.uksouth.cloudapp.azure.com/chat/",
      chatId: import.meta.env.VITE_FIONA_CHAT_ID,
    };
  },

  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },

  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;

      if (!this.isOpen) {
        this.isMaximized = false;
      }
    },

    closeChat() {
      this.isOpen = false;
      this.isMaximized = false;
    },

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
    },

    handleKeydown(event) {
      if (event.key !== "Escape") return;

      if (this.isMaximized) {
        this.isMaximized = false;
        return;
      }

      this.closeChat();
    },
  },
};
</script>

<style scoped>
.fairsharing-chat {
  position: fixed;
  right: 24px;
  bottom: 80px;
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
  cursor: pointer;
}

.fairsharing-chat__button:hover {
  filter: brightness(1.08);
}

.fairsharing-chat__button:focus-visible,
.fairsharing-chat__header-button:focus-visible {
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
  bottom: 78px;
  display: flex;
  width: min(500px, calc(100vw - 32px));
  height: min(720px, calc(100vh - 230px));
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: white;
  box-shadow: 0 12px 40px rgb(0 0 0 / 30%);
  transition:
      width 180ms ease,
      height 180ms ease,
      inset 180ms ease,
      border-radius 180ms ease;
}

.fairsharing-chat__window--maximized {
  width: min(1450px, calc(100vw - 32px));
  height: min(1020px, calc(100vh - 180px));
  border-radius: 12px;
}

.fairsharing-chat__header {
  display: flex;
  min-height: 52px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 16px;
  background: #186f65;
  color: white;
  font-weight: 600;
}

.fairsharing-chat__header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fairsharing-chat__header-button {
  display: flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: white;
  cursor: pointer;
}

.fairsharing-chat__header-button:hover {
  background: rgb(255 255 255 / 15%);
}

.fairsharing-chat__header-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.fairsharing-chat__close {
  font-size: 28px;
  line-height: 1;
}

.fairsharing-chat__iframe {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
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

  .fairsharing-chat__window--maximized {
    inset: 0;
    border-radius: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fairsharing-chat__window,
  .chat-window-enter-active,
  .chat-window-leave-active {
    transition: none;
  }
}
</style>
