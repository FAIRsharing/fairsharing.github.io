import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initColorFix } from "@/utils/colorFix";

describe("Global Color Fix Utility", () => {
  let appContainer;

  // Run this before every single test to ensure a clean slate
  beforeEach(() => {
    // Clear the document
    document.body.innerHTML = "";

    // Create the #app container that the script expects
    appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);
  });

  // Clean up after every test
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should fix existing elements on initial load", () => {
    // Arrange: Create a <p> tag with pure black color
    const p = document.createElement("p");
    p.style.color = "rgb(0, 0, 0)";
    appContainer.appendChild(p);

    // Act: Initialize the script
    initColorFix();

    // Assert: Check if the color was changed and has the !important flag
    expect(p.style.color).toBe("rgba(0, 0, 0, 0.87)");
    expect(p.style.getPropertyPriority("color")).toBe("important");
  });

  it("should ignore elements that are NOT pure black", () => {
    const p = document.createElement("p");
    p.style.color = "rgb(255, 0, 0)"; // Red
    appContainer.appendChild(p);

    initColorFix();

    // Color should remain red
    expect(p.style.color).toBe("rgb(255, 0, 0)");
  });

  it("should ignore non-matching HTML tags", () => {
    const span = document.createElement("span");
    span.style.color = "rgb(0, 0, 0)";
    appContainer.appendChild(span);

    initColorFix();

    // <span> is not in "p, h1, h2, h3, h4, h5, h6, b", so it should be skipped
    expect(span.style.color).toBe("rgb(0, 0, 0)");
  });

  it("should fix dynamically added tags directly via MutationObserver", async () => {
    initColorFix(); // Start the observer first

    // Dynamically create and append a <b> tag
    const b = document.createElement("b");
    b.style.color = "rgb(0, 0, 0)";
    appContainer.appendChild(b);

    // MutationObservers are asynchronous (microtasks).
    // We must wait a tick for the observer to fire.
    await Promise.resolve();

    expect(b.style.color).toBe("rgba(0, 0, 0, 0.87)");
  });

  it("should fix dynamically added elements inside wrappers via querySelectorAll", async () => {
    initColorFix();

    // Create a wrapper <div> containing an <h1>
    const wrapper = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.style.color = "rgb(0, 0, 0)";

    wrapper.appendChild(h1);

    // Append the wrapper to the DOM
    appContainer.appendChild(wrapper);

    // Wait for the observer
    await Promise.resolve();

    expect(h1.style.color).toBe("rgba(0, 0, 0, 0.87)");
  });
});
