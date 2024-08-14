const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

chrome.storage.local.get("code", async function getData(data) {
  init(data);
});

chrome.storage.local.get("threshold", async function getData(data) {
  $("#threshold").value = Number(data.threshold) || 0.01;
  $("#thresholdDisplay").innerText = $("#threshold").value;
});

function init(data) {
  const code = $("#code");
  code.value = data?.code || defaultAvatarHTML;

  $("#threshold").addEventListener("change", () => {
    const threshold = Number($("#threshold").value || 0.01);
    $("#thresholdDisplay").innerText = $("#threshold").value;
    chrome.storage.local.set({ threshold: threshold }, () => {});
  });
  $("#threshold").addEventListener("mousemove", () => {
    const threshold = Number($("#threshold").value || 0.01);
    $("#thresholdDisplay").innerText = $("#threshold").value;
    chrome.storage.local.set({ threshold: threshold }, () => {});
  });

  code.addEventListener("keyup", () => {
    updateCode();
  });

  code.addEventListener("paste", (event) => {
    const yes = confirm(
      "Reminder: only paste code you can trust! \n\nAre you sure you want to continue?"
    );
    if (yes) {
      setTimeout(() => {
        updateCode();
      }, 100);
    } else {
      event.preventDefault();
    }
  });

  const preHighlight = $("#preHighlight");
  // highlight on load:
  highlightHTMLAndText(code, preHighlight);
  // oninput is on immediate change:
  code.addEventListener("input", () => {
    highlightHTMLAndText(code, preHighlight);
  });
  // onkeyup to handle even arrow keys:
  code.addEventListener("keyup", () => {
    highlightHTMLAndText(code, preHighlight);
  });
}

function updateCode() {
  const code = $("#code").value;
  if (!code) {
    // if empty:
    $("#code").value = defaultAvatarHTML;
    chrome.storage.local.set({ code: simpleSanitize($("#code").value) });
  } else if (codeHasRequiredID(code)) {
    chrome.storage.local.set({ code: simpleSanitize(code) }, () => {});
  } else {
    // if not empty but missing required ID:
    $("#code").value = generateDefaultAvatarHTML(
      `  <!-- customize id="_togglavatar_lo" and id="_togglavatar_hi" here -->`
    );
    chrome.storage.local.set({ code: simpleSanitize($("#code").value) });
  }
}

function codeHasRequiredID(code) {
  return new RegExp(` id=["']${togglavatar_containerID}["']`).test(code);
}

/** do simple sanitization anyways, even though warn user about pasting */
function simpleSanitize(code) {
  return code // lowercase tag names:
    .replace(/<\/?\s*([a-zA-Z][a-zA-Z0-9]*)/g, (match) => {
      return match.toLowerCase();
    }) // remove new lines within tags:
    .replace(/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)\s*>/g, (match) => {
      return match.replace(/\s+/g, "").replace(/>/g, ">");
    }) // only allow id/class/style as tag attributes:
    .replace(/<(\w+)([^>]*)>/g, (match, tagName, attributes) => {
      const allowedAttributes =
        attributes.match(/\s*(id|class|style)\s*=\s*(['"])[^'"]*\2/g) || [];
      return `<${tagName}${allowedAttributes.join(" ")}>`;
    }) // remove tags like script/iframe:
    .replace(
      /<\/?\s*(script|iframe|object|embed|form|input|link|meta|audio|video|source|applet|base|basefont|frame|frameset|noframes|bgsound|blink|layer|ilayer|marquee|plaintext|textarea)([^>]*)>/gi,
      "<div$2>"
    )
    .replace(/\bimport\b/gi, "")
    .replace(/\brequire\b/gi, "")
    .replace(/\burl\b/gi, "")
    .replace(/script\s*:/gi, "");
}

function highlightHTMLAndText(textarea, preHighlight) {
  textarea.style.height = textarea.scrollHeight + "px";
  preHighlight.style.height = textarea.scrollHeight + "px";
  textarea.style.width = textarea.scrollWidth + "px";
  preHighlight.style.width = textarea.scrollWidth + "px";

  const code = textarea.value;
  preHighlight.innerHTML = code
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(&lt;.+?&gt;)/g, '<span class="tagHighlight">$1</span>')
    .replace(
      /(?<!class="tagHighlight")>([^<]+)</g,
      '><span class="textHighlight">$1</span><'
    );
}
