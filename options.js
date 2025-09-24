// options.js

document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  // Load saved key
  chrome.storage.sync.get(["GEMINI_API_KEY"], (result) => {
    if (result.GEMINI_API_KEY) {
      apiKeyInput.value = result.GEMINI_API_KEY;
    }
  });

  saveBtn.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      status.textContent = "Please enter a valid API key.";
      status.style.color = "#fa5959";
      return;
    }

    chrome.storage.sync.set({ GEMINI_API_KEY: apiKey }, () => {
      status.textContent = "API key saved successfully!";
      status.style.color = "#7fd7fd";
      setTimeout(() => (status.textContent = ""), 2000);
    });
  });
});