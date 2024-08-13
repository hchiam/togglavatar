const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

chrome.storage.local.get("code", async function getData(data) {
  init(data);
});

function init(data) {
  $("#code").value = data?.code || defaultAvatarHTML;

  $("#code").addEventListener("keyup", () => {
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
  });
}

function codeHasRequiredID(code) {
  return new RegExp(` id=["']${togglavatar_containerID}["']`).test(code);
}
