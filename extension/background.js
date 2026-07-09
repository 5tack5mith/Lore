console.log("Lore background script loaded");

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