chrome.storage.local.get("threshold", function getData(data) {
  const threshold = data.threshold;

  chrome.storage.local.get("code", async function getData(data) {
    await renderAvatar(data.code);
    const avatar = document.querySelector("#" + togglavatar_containerID);

    if (!avatar) return;

    const lo = avatar.querySelector("#" + togglavatar_loID);
    const hi = avatar.querySelector("#" + togglavatar_hiID);

    onMicVolume((volume) => {
      const isHi = volume > (Number(threshold) || 0.01);
      if (isHi) {
        lo?.classList.remove("show");
        hi?.classList.add("show");
      } else {
        lo?.classList.add("show");
        hi?.classList.remove("show");
      }
    });

    moveAvatarOutOfTheWay(
      document.querySelector("#" + togglavatar_containerID)
    );

    const pollInterval = 100;
    updateContainerIfFullScreen(
      (container) => {
        if (!container.contains(avatar)) container.appendChild(avatar);
      },
      pollInterval,
      document.documentElement
    );
  });
});

async function renderAvatar(customHTML) {
  document.documentElement.insertAdjacentHTML(
    "beforeend",
    customHTML || defaultAvatarHTML
  );
  const avatarContainer = document.querySelector("#" + togglavatar_containerID);
  avatarContainer.style.maxWidth = "25dvw";
  avatarContainer.style.maxHeight = "25dvw";
  avatarContainer.style.overflow = "hidden";
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

function updateContainerIfFullScreen(
  callback,
  pollInterval = 1000,
  fallbackElement = document.body
) {
  return setInterval(() => {
    const fullscreenElement = document.querySelector(":fullscreen");
    if (fullscreenElement) {
      callback(fullscreenElement);
    } else {
      callback(fallbackElement);
    }
  }, pollInterval);
}
