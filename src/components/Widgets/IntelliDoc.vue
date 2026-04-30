<template>
  <div id="chatbot-container"></div>
</template>
<script>
export default {
  name: "IntelliDoc.vue",
  mounted() {
    if (!document.getElementById("intellidoc-script")) {
      const script = document.createElement("script");
      script.id = "intellidoc-script";
      script.src =
        "https://aicc.uksouth.cloudapp.azure.com/features/intellidoc";
      script.async = true;

      // Pass configuration/API keys from .env
      script.onload = () => {
        window.IntelliDoc.init({
          botId: import.meta.env.VITE_INTELLIDOC_ID,
          container: "#chatbot-container",
        });
      };

      document.body.appendChild(script);
    }
  },
};
</script>

<style scoped></style>
