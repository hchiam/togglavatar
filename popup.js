const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

chrome.storage.local.get("code", async function getData(data) {
  init(data);
});

chrome.storage.local.get("threshold", async function getData(data) {
  $("#threshold").value = Number(data.threshold);
  $("#thresholdDisplay").innerText = $("#threshold").value;
});

function init(data) {
  $("#code").value = data?.code || defaultAvatarHTML;

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

  $("#code").addEventListener("keyup", () => {
    updateCode();
  });

  $("#code").addEventListener("paste", (event) => {
    const yes = confirm(
      "Reminder: only paste code you can trust! \n\nContinue?"
    );
    if (yes) {
      setTimeout(() => {
        updateCode();
      }, 100);
    } else {
      event.preventDefault();
    }
  });
}

function updateCode() {
  const code = $("#code").value;
  if (!code) {
    $("#code").value = defaultAvatarHTML;
    chrome.storage.local.set({ code: $("#code").value }, () => {});
  } else if (codeHasRequiredID(code)) {
    chrome.storage.local.set({ code: code }, () => {});
  } else {
    $("#code").value = generateDefaultAvatarHTML(
      `  <!-- customize id="_togglavatar_lo" and id="_togglavatar_hi" here -->`
    );
    chrome.storage.local.set({ code: $("#code").value }, () => {});
  }
}

function codeHasRequiredID(code) {
  return new RegExp(` id=["']${togglavatar_containerID}["']`).test(code);
}
