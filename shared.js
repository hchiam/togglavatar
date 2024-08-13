const togglavatar_containerID = "_togglavatar";
const togglavatar_loID = "_togglavatar_lo";
const togglavatar_hiID = "_togglavatar_hi";

// You might find this useful for finding symbols: https://shapecatcher.com/
const defaultAvatarHTML = generateDefaultAvatarHTML(
  `<!-- customize id="_togglavatar_lo" and id="_togglavatar_hi" here -->
  <pre id="${togglavatar_loID}">- -
. .
 - </pre><pre id="${togglavatar_hiID}">^ ^
. .
 o </pre>`
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
  right: 1rem;
  bottom: 1rem;
  transition: right 0.2s;
  z-index: 9999999;
}
#${togglavatar_containerID}:focus {
  outline-width: 0.5rem;
}
#${togglavatar_containerID} pre {
  background: #ffffffc2:
  color: black;
  font-family: monospace;
  font-size: 2rem;
  border: none;
  border-radius: 0;
  text-align: center;
  padding: 0 1rem;
  margin: 0;
  line-height: 1;
  overflow: hidden;
}
#${togglavatar_containerID} #${togglavatar_loID},
#${togglavatar_containerID} #${togglavatar_hiID} {
  display: none;
}
#${togglavatar_containerID} #${togglavatar_loID}.show,
#${togglavatar_containerID} #${togglavatar_hiID}.show {
  display: revert;
}
</style>`;
}
