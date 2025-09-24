// content.js
let shadow;

if (!window.__geminiEnhancerDialogInjected) {
  window.__geminiEnhancerDialogInjected = true;

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.top = "100px";
  host.style.left = "100px";
  host.style.zIndex = "999999";
  host.style.width = "340px";
  host.style.height = "auto";
  host.style.minWidth = "250px";
  host.style.minHeight = "100px";
  document.body.appendChild(host);

  shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    .gemini-dialog-box {
      width: 100%; height: 100%;
      background: #222; color: #fff;
      border-radius: 8px; box-shadow: 0 0 12px #0004;
      font-family: inherit, sans-serif; overflow: hidden;
      display: flex; flex-direction: column;
      resize: both;
      position: relative;
    }
    .dialog-header {
      cursor: move;
      background: #1a1a1a; padding: 8px; user-select: none;
      display: flex; justify-content: space-between; align-items: center;
    }
    .dialog-content {
      padding: 10px;
      overflow: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .resize-handle {
      width: 12px;
      height: 12px;
      background: #0a84ff;
      position: absolute;
      bottom: 2px;
      right: 2px;
      cursor: se-resize;
      border-radius: 3px;
    }
    select, textarea, button {
      margin-top: 6px;
      font-family: inherit;
      font-size: 1em;
    }
    select, textarea {
      width: 100%;
      border-radius: 4px;
      border: none;
      padding: 6px;
      background: #333;
      color: white;
      resize: vertical;
    }
    button {
      padding: 8px;
      border: none;
      border-radius: 4px;
      background: #0a84ff;
      color: white;
      cursor: pointer;
      font-weight: 600;
    }
    #resultBox {
      margin-top: 8px;
      min-height: 50px;
      background: #181c20;
      padding: 5px;
      border-radius: 4px;
      white-space: pre-wrap;
      word-break: break-word;
      flex-grow: 1;
    }
  `;
  shadow.appendChild(style);

  const dialog = document.createElement("div");
  dialog.className = "gemini-dialog-box";
  dialog.innerHTML = `
    <div class="dialog-header" id="header">
      <span>Gemini Text Enhancer</span>
      <span id="closeBtn" style="cursor:pointer;">&#10005;</span>
    </div>
    <div class="dialog-content">
      <select id="modeSelect">
        <option value="enhance">Enhance Grammar</option>
        <option value="formal">Make Formal</option>
        <option value="json">Convert to JSON (for LLMs)</option>
        <option value="summarize">Summarize</option>
        <option value="bullets">Bullet Points</option>
      </select>
      <textarea id="mainInput" placeholder="Enter your text here..." style="height:70px;"></textarea>
      <textarea id="promptInput" placeholder="Optional prompt/instructions..." style="height:40px;"></textarea>
      <button id="sendBtn">Send</button>
      <div id="resultBox"></div>
    </div>
    <div class="resize-handle"></div>
  `;
  shadow.appendChild(dialog);

  shadow.getElementById("closeBtn").onclick = () => host.remove();

  // draggable and resize handlers here ...
  // Draggable
  const header = shadow.getElementById("header");
  let offsetX,
    offsetY,
    dragging = false;
  header.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - host.getBoundingClientRect().left;
    offsetY = e.clientY - host.getBoundingClientRect().top;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (dragging) {
      host.style.left = e.clientX - offsetX + "px";
      host.style.top = e.clientY - offsetY + "px";
    }
  });
  document.addEventListener("mouseup", () => (dragging = false));

  // Resize handle
  const resizeHandle = shadow.querySelector(".resize-handle");
  let resizing = false,
    startX,
    startY,
    startW,
    startH;
  resizeHandle.addEventListener("mousedown", (e) => {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = host.offsetWidth;
    startH = host.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener("mousemove", (e) => {
    if (resizing) {
      host.style.width = Math.max(250, startW + (e.clientX - startX)) + "px";
      host.style.height = Math.max(100, startH + (e.clientY - startY)) + "px";
    }
  });
  document.addEventListener("mouseup", () => (resizing = false));

  // **Send button inside injection block to guarantee shadow defined**
  shadow.getElementById("sendBtn").addEventListener("click", () => {
    const mode = shadow.getElementById("modeSelect").value;
    const input = shadow.getElementById("mainInput").value.trim();
    const prompt = shadow.getElementById("promptInput").value.trim();

    if (!input) {
      shadow.getElementById("resultBox").textContent =
        "Please enter some text!";
      return;
    }

    try {
      chrome.runtime.sendMessage(
        {
          type: "process",
          mode,
          prompt,
          input,
          site: window.location.hostname,
        },
        (res) => {
          if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
            shadow.getElementById("resultBox").textContent =
              "chrome.runtime.sendMessage API not available in this context.";
            return;
          }
          if (chrome.runtime.lastError) {
            shadow.getElementById("resultBox").textContent =
              "Failed to communicate with background script.";
            return;
          }
          shadow.getElementById("resultBox").textContent =
            res?.result || "No response";
        }
      );
    } catch (err) {
      shadow.getElementById("resultBox").textContent =
        "Unexpected error occurred.";
    }
  });
}
