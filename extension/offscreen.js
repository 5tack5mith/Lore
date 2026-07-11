console.log("Lore offscreen document loaded (pdf.js runs here — real document, unlike the service worker)");

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("libs/pdf.worker.js");

// pdf_capture.js (in the background service worker) sends EXTRACT_PDF_TEXT
// messages here because pdf.js needs a real document/window to run — the
// service worker has neither a DOM nor (reliably) nested Workers.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "EXTRACT_PDF_TEXT") return false; // not for us

  extractPdfText(message.url)
    .then(text => sendResponse({ ok: true, text }))
    .catch(err => sendResponse({ ok: false, error: err.message }));

  return true; // keep the message channel open for the async sendResponse above
});

async function extractPdfText(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map(item => item.str).join(" ") + "\n\n";
  }
  return fullText.trim();
}
