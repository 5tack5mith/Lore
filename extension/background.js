console.log("Lore background script loaded");

// PDF capture: Chrome's built-in PDF viewer does not allow content scripts
// to run inside it at all, so pdf_capture.js watches tab navigation from
// here instead. The actual pdf.js parsing happens in an offscreen document
// (offscreen.html/offscreen.js) since pdf.js needs a real DOM that this
// service worker doesn't have. See pdf_capture.js for details.
importScripts("pdf_capture.js");

const PC_ENDPOINT = "http://localhost:8000/index/web"; // update with real PC IP later

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CAPTURE_PAGE") {
    sendToLore(message.data);
  }
});

async function sendToLore(pageData) {
  try {
    const response = await fetch(PC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData)
    });

    if (response.ok) {
      console.log("Lore: indexed", pageData.title);
    }
  } catch (err) {
    console.error("Lore: failed to reach PC —", err.message);
  }
}