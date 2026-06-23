<template>
  <div class="code-block-wrapper">
    <div class="code-header">
      <span class="dot bg-red"></span>
      <span class="dot bg-yellow"></span>
      <span class="dot bg-green"></span>
      <span class="lang-label">{{ lang }}</span>
    </div>

    <div v-safe-html="highlightedHtml" class="shiki-container"></div>

    <div ref="sourceElement" style="display: none"><slot></slot></div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import {codeToHtml} from "shiki";

const props = defineProps({
  lang: { type: String, default: "javascript" },
  theme: { type: String, default: "tokyo-night" },
});

const sourceElement = ref(null);
const highlightedHtml = ref("");

onMounted(async () => {
  await nextTick();
  // Extract text content after Vue fills variables like {{ loginUrl }}
  let rawCode =
    sourceElement.value?.innerText || sourceElement.value?.textContent || "";

  // Clean up initial and trailing whitespace artifacts from <pre> tags
  rawCode = rawCode.replace(/^\s*[\r\n]/, "").trimEnd();

  try {
    highlightedHtml.value = await codeToHtml(rawCode, {
      lang: props.lang,
      theme: props.theme,
    });
  }
  catch (err) {
    console.error("Shiki highlighting failed:", err);
    highlightedHtml.value = `<pre><code>${rawCode}</code></pre>`;
  }
});
</script>

<style scoped>
.code-block-wrapper {
  border-radius: 8px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.code-header {
  background: #16161e;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #24283b;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.red {
  background: #ff5f56;
}
.yellow {
  background: #ffbd2e;
}
.green {
  background: #27c93f;
}
.lang-label {
  margin-left: auto;
  color: #565f89;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-family: monospace;
  font-weight: bold;
}
:deep(.shiki) {
  margin: 0 !important;
  padding: 1.2rem !important;
  overflow-x: auto;
  font-family: "Fira Code", Consolas, Monaco, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
