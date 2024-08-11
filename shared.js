const togglavatar_containerID = "_togglavatar";
const togglavatar_loID = "_togglavatar_lo";
const togglavatar_hiID = "_togglavatar_hi";

// You might find this useful for finding symbols: https://shapecatcher.com/

/** (note: I had to encode special characters for saving in this JS file.) */
const defaultAvatarHTML = generateDefaultAvatarHTML(
  // `<pre id="eyebrows"> ⌒ ⌒ </pre><pre> • • </pre><pre id="${togglavatar_loID}">  ᴗ  </pre><pre id="${togglavatar_hiID}">  <b>ס</b>  </pre>`
  `<pre id="eyebrows"> \u2312 \u2312 </pre><pre> \u2022 \u2022 </pre><pre id="${togglavatar_loID}">  \u1d17  </pre><pre id="${togglavatar_hiID}">  <b>\u05e1</b>  </pre>`
);

function generateDefaultAvatarHTML(customContent) {
  return `<div id="${togglavatar_containerID}" tabindex="-1">
  ${customContent}
</div><style>
#${togglavatar_containerID} {
  all: unset;
  background: #ffffffc2;
  outline: 0.2rem solid black;
  width: fit-content;
  height: fit-content;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
  cursor: grab;
  position: fixed;
  right: 16px;
  bottom: 16px;
  transition: right 0.2s, outline 1s;
  z-index: 9999999;
}
#${togglavatar_containerID}:focus {
  outline-width: 0.5rem;
}
#${togglavatar_containerID}:has(#${togglavatar_hiID}.show) {
  outline-color: #0f8;
  transition: right 0.2s, outline 0.5s;
}
#${togglavatar_containerID} pre {
  font-family: monospace;
  font-size: 2rem;
  border: none;
  border-radius: 0;
  text-align: center;
  padding: 0.25rem 0;
  margin: 0;
  line-height: 1;
  overflow: hidden;
  color: black;
}
#${togglavatar_containerID} #eyebrows {
  margin-bottom: -1rem;
}
#${togglavatar_containerID} #${togglavatar_loID},
#${togglavatar_containerID} #${togglavatar_hiID} {
  margin-top: -0.5rem;
  display: none;
}
#${togglavatar_containerID} #${togglavatar_loID}.show,
#${togglavatar_containerID} #${togglavatar_hiID}.show {
  display: revert;
}
</style>`;
}
