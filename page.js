chrome.storage.local.get("code", async function getData(data) {
  await renderAvatar(data.code);
  const avatar = document.querySelector("#" + togglavatar_containerID);

  if (!avatar) return;

  const lo = avatar.querySelector("#" + togglavatar_loID);
  const hi = avatar.querySelector("#" + togglavatar_hiID);

  onMicVolume((volume) => {
    const isHi = volume > 0.01;
    if (isHi) {
      lo?.classList.remove("show");
      hi?.classList.add("show");
    } else {
      lo?.classList.add("show");
      hi?.classList.remove("show");
    }
  });

  moveAvatarOutOfTheWay(document.querySelector("#" + togglavatar_containerID));
});

async function renderAvatar(customHTML) {
  document.documentElement.insertAdjacentHTML(
    "beforeend",
    customHTML || defaultAvatarHTML
  );
}

/** based off of https://jameshfisher.com/2021/01/18/measuring-audio-volume-in-javascript/ */
async function onMicVolume(callback) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode =
    audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  mediaStreamAudioSourceNode.connect(analyserNode);

  const pcmData = new Float32Array(analyserNode.fftSize);
  const onFrame = () => {
    analyserNode.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) {
      sumSquares += amplitude * amplitude;
    }
    const volume = Math.sqrt(sumSquares / pcmData.length);
    callback(volume);
    window.requestAnimationFrame(onFrame);
  };
  window.requestAnimationFrame(onFrame);
}

function moveAvatarOutOfTheWay(avatarContainer) {
  // get out of the way of the mouse:
  avatarContainer.addEventListener("mouseenter", () => {
    const viewHalfWidth = window.innerWidth / 2;
    const viewHalfHeight = window.innerHeight / 2;
    const { x, y, width: w } = avatarContainer.getBoundingClientRect();
    const midX = x + w / 2;
    const offset = 16;
    if (midX < viewHalfWidth) {
      // move right
      avatarContainer.style.right = offset + "px";
    } else {
      // move left
      avatarContainer.style.right = window.innerWidth - w - 2 * offset + "px";
    }
  });
}
