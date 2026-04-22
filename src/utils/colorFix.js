// 1. The function that actually checks and changes the color
const applyOpacityFix = (el) => {
  const computedStyle = window.getComputedStyle(el);
  if (computedStyle.color === "rgb(0, 0, 0)") {
    el.style.setProperty("color", "rgba(0, 0, 0, 0.87)", "important");
  }
};

// 2. The function that hunts down the tags
const scanAndFix = (rootNode) => {
  // If the added node itself is a text tag, fix it
  if (rootNode.matches && rootNode.matches("p, h1, h2, h3, h4, h5, h6, b")) {
    applyOpacityFix(rootNode);
  }

  // If the added node is a container (like a v-card or div), search inside it
  if (rootNode.querySelectorAll) {
    const textElements = rootNode.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, b",
    );
    textElements.forEach(applyOpacityFix);
  }
};
export const initColorFix = () => {
  // 3. Set up the observer to watch Vue routing and rendering
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Only check HTML elements (ignore pure text nodes or comments)
        if (node.nodeType === 1) {
          scanAndFix(node);
        }
      });
    });
  });

  // 4. Start watching the whole app for changes
  const appContainer = document.getElementById("app") || document.body;
  observer.observe(appContainer, {
    childList: true,
    subtree: true,
  });

  // 5. Run it once manually for the very first page load
  scanAndFix(appContainer);
};
