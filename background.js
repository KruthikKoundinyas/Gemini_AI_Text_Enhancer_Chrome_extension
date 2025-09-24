// background.js
import { getGeminiApiKey } from "./config.js";
getGeminiApiKey((key) => {
  if (!key) {
    console.warn("No Gemini API key set. Please add it in Options.");
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Message received in background:", msg);

  if (msg.type === "process") {
    const prompt = buildPrompt(msg);
    console.log("Built prompt:", prompt);

    getGeminiApiKey((apiKey) => {
      console.log(
        "Using API key:",
        apiKey ? apiKey.substring(0, 6) + "..." : "NO KEY"
      );

      if (!apiKey) {
        sendResponse({ result: "No API key set. Please add it in Options." });
        return;
      }

      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          console.log("API raw response:", data);
          if (data.error) {
            console.error("Gemini API error:", data.error);
            sendResponse({
              result: `Gemini API error: ${data.error.message || "Unknown"}`,
            });
            return;
          }

          const geminiResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
          console.log("Processed API response:", geminiResponse);
          sendResponse({ result: geminiResponse });
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          sendResponse({ result: "Error contacting Gemini: " + err.message });
        });
    });

    return true; // async response
  }
});

// Function to construct prompt based on mode and site context
function buildPrompt(msg) {
  const input = msg.input || "";
  const userPrompt = msg.prompt?.trim() ? msg.prompt.trim() + "\n\n" : "";
  const mode = msg.mode || "enhance";
  const site = msg.site || "";

  // Site-specific tone/formatting instructions
  const siteInstructionsMap = {
    "twitter.com":
      "Keep it concise and suitable for a tweet. Output only the final text.",
    "linkedin.com":
      "Make it professional and engaging for LinkedIn. Output only the final text.",
    "facebook.com":
      "Make it friendly and conversational for Facebook. Output only the final text.",
    "reddit.com":
      "Make it casual and suitable for Reddit discussions. Output only the final text.",
    "perplexity.ai":
      "Make it concise, factual, and easy to read. Output only the final text.",
    "claude.ai":
      "Format for Claude AI input. Output only the final text or JSON as required.",
    "generativelanguage.googleapis.com":
      "Format the output for Gemini AI usage. Output only the final text or JSON if requested.",
    gemini:
      "Format the output for Gemini AI usage. Output only the final text or JSON if requested.",
    "chat.openai.com":
      "Format the output for ChatGPT. Output only the final content or JSON if requested.",
  };

  let siteInstruction = "Output only the final text, ready to copy and paste.";
  for (const domain in siteInstructionsMap) {
    if (site.includes(domain)) {
      siteInstruction = siteInstructionsMap[domain];
      break;
    }
  }

  // Mode-specific instructions
  const modeInstructions = {
    enhance:
      "Correct and improve the grammar, clarity, and style of this text.",
    formal: "Rewrite this text to be more formal and polished.",
    json: "Convert this text into a structured JSON format suitable for AI input. Include all meaning and key details.",
    summarize: "Summarize this text clearly and concisely.",
    bullets:
      "Extract the key points from this text and list them as bullet points.",
  };

  const modeInstruction = modeInstructions[mode] || "";

  // Combine all parts into the final prompt
  return `${userPrompt}${modeInstruction} ${siteInstruction}\n\n${input}`.trim();
}
