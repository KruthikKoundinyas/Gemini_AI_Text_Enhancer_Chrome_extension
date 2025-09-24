document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputText");
  const mode = document.getElementById("modeSelect");
  const prompt = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");
  const resultBox = document.getElementById("resultBox");
  const copyBtn = document.getElementById("copyBtn");
  const errorBox = document.getElementById("errorBox");

  promptInput.focus();

  sendBtn.addEventListener("click", () => {
    errorBox.textContent = "";
    resultBox.textContent = "";
    sendBtn.disabled = true;
    sendBtn.textContent = "Processing...";

    const text = input.value.trim();
    if (!text) {
      errorBox.textContent = "Please enter text!";
      sendBtn.disabled = false;
      sendBtn.textContent = "Send to Gemini";
      return;
    }

    chrome.runtime.sendMessage(
      {
        type: "process",
        mode: mode.value,
        prompt: prompt.value.trim(),
        input: text, // send popup input explicitly
        site: window.location.hostname,
      },
      (res) => {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send to Gemini";
        if (!res || !res.result) {
          errorBox.textContent = "No response or error occurred.";
          return;
        }
        resultBox.textContent = res.result;
      }
    );
  });

  copyBtn.addEventListener("click", () => {
    if (!resultBox.textContent.trim()) {
      errorBox.textContent = "Nothing to copy.";
      return;
    }
    navigator.clipboard.writeText(resultBox.textContent).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    });
  });
});