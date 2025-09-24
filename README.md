# Gemini AI Text Enhancer (Chrome Extension)

Gemini AI Text Enhancer is a Chrome extension that provides **grammar correction** and **context-aware text enhancement** using Google's **Generative Language API (Gemini)**. It integrates seamlessly into webpages, allowing users to refine and improve written content interactively.

---

### Features

- Grammar checking and sentence corrections.
- Context-aware text enhancement with Gemini AI.
- Collapsible floating UI on webpages with:
  - Prompt input box
  - Context selection dropdown
  - "Send" button to interact with Gemini AI
- Popup interface for quick access.
- Options page for customization (API key storage, settings).
---

### Demo Video

<!-- [Gemini AI Text Enhancer Demo](Demo.mp4) -->
<video width="100%" controls>
  <source src="Demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
> 📽️ Click to watch the full demo.

---

### Project Structure

```
gemini-ai-extension/
├─ .env               # Stores sensitive API keys (ignored by Git)
├─ .gitignore         # Git ignore rules
├─ background.js      # Service worker handling API calls
├─ config.js          # Config file for API integration (ignored by Git)
├─ content.js         # Content script - UI injected into pages
├─ favicon.ico        # Extension icon
├─ manifest.json      # Chrome extension manifest (v3)
├─ options.html       # Extension options page
├─ options.js         # Logic for options page
├─ popup.html         # Popup UI
├─ popup.js           # Popup script
└─ README.md          # Project documentation
```

---

### Installation

1. Clone the repository (without `.env` or `config.js`, since they are ignored on GitHub):
   ```bash
   git clone https://github.com/yourusername/gemini-ai-extension.git
   cd gemini-ai-extension
   ```
2. Create a `.env` and add your **Google Generative Language API key**:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. (Optional) Add API key in `config.js` if you’re not using environment injection.

4. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
5. Enable **Developer mode**.

6. Click **Load unpacked** and select the `gemini-ai-extension` folder.

7. open extention options link and paste your api link in the input feild and submit to load your Gemini api key

---

### Development

- Content script (`content.js`) injects UI into pages.
- Background worker (`background.js`) handles API requests.
- Options page allows saving API keys/settings with Chrome storage.
- Popup page provides a quick interface.

You can test changes by:

1. Reloading the extension in `chrome://extensions/`.
2. Refreshing the page where it’s active.

---

### Usage

#### One Time Setup Stage

    * open extention options link and paste your api link in the input feild and submit to load your Gemini api key

1. Navigate to any webpage with text.
2. Open the floating Gemini AI dialog box.
3. Enter prompt or highlight text for enhancement.
4. View corrected/enhanced text suggestions.

---

### License

This project is licensed under the MIT License.
