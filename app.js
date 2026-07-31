const crafts = {
  rabbit: {
    name: "うさぎ",
    emoji: "🐰",
    pdf: "pdf/うさぎ_かたがみ.pdf",
    steps: [
      "かみこっぷを さかさまに おく",
      "みみと かおを きる",
      "みみと かおを はる",
      "できあがり！"
    ]
  },
  frog: {
    name: "かえる",
    emoji: "🐸",
    pdf: "pdf/かえる_かたがみ.pdf",
    steps: [
      "みどりの かみを はる",
      "め・くち・てあしを きる",
      "かみこっぷに はる",
      "できあがり！"
    ]
  },
  lion: {
    name: "らいおん",
    emoji: "🦁",
    pdf: "pdf/らいおん_かたがみ.pdf",
    steps: [
      "きいろの かみを はる",
      "たてがみと かおを きる",
      "かみこっぷに はる",
      "できあがり！"
    ]
  },
  penguin: {
    name: "ぺんぎん",
    emoji: "🐧",
    pdf: "pdf/ぺんぎん_かたがみ.pdf",
    steps: [
      "くろい かみを はる",
      "おなか・くちばし・つばさを きる",
      "かみこっぷに はる",
      "できあがり！"
    ]
  },
  rocket: {
    name: "ろけっと",
    emoji: "🚀",
    pdf: "pdf/ろけっと_かたがみ.pdf",
    steps: [
      "あおい かみを はる",
      "まど・つばさ・ほのおを きる",
      "かみこっぷに はる",
      "できあがり！"
    ]
  },
  flower: {
    name: "おはな",
    emoji: "🌸",
    pdf: "pdf/おはな_かたがみ.pdf",
    steps: [
      "みどりの かみを はる",
      "はなびら・まんなか・はっぱを きる",
      "かみこっぷに はる",
      "できあがり！"
    ]
  }
};

let selected = "rabbit";
let stream = null;
let guideTimer = null;

const $ = (id) => document.getElementById(id);

function renderButtons() {
  const root = $("craftGrid");
  root.innerHTML = "";

  Object.entries(crafts).forEach(([key, craft]) => {
    const button = document.createElement("button");
    button.className = "craft" + (key === selected ? " selected" : "");
    button.innerHTML = `<span>${craft.emoji}</span>${craft.name}`;
    button.addEventListener("click", () => {
      selected = key;
      renderButtons();
      renderCraft();
    });
    root.appendChild(button);
  });
}

function renderCraft() {
  const craft = crafts[selected];
  $("craftTitle").textContent = `${craft.emoji} ${craft.name}の つくりかた`;
  $("steps").innerHTML =
    "<ol>" + craft.steps.map(step => `<li>${step}</li>`).join("") + "</ol>";
  $("pdfLink").href = craft.pdf;
  $("cameraTitle").textContent = `${craft.emoji} ${craft.name}を もってね`;
}

$("nextBtn").addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    $("video").srcObject = stream;
    await $("video").play();
    $("cameraPanel").classList.add("open");
    $("cameraPanel").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    alert("かめらを つかえません。かめらの きょかを かくにんしてね。");
  }
});

$("playBtn").addEventListener("click", () => {
  const sequence = [
    "🎵 おんがくあそびが はじまるよ！",
    "➡️ みぎに ゆらゆら",
    "⬅️ ひだりに ゆらゆら",
    "🙌 たかく あげよう！",
    "🔄 くるっと まわそう！",
    "🎉 じょうずに できたね！"
  ];

  let index = 0;
  $("guide").textContent = sequence[0];
  clearInterval(guideTimer);

  guideTimer = setInterval(() => {
    index += 1;
    if (index < sequence.length) {
      $("guide").textContent = sequence[index];
    } else {
      clearInterval(guideTimer);
    }
  }, 3500);
});

$("stopBtn").addEventListener("click", () => {
  clearInterval(guideTimer);
  $("guide").textContent = "とめたよ";
});

$("closeBtn").addEventListener("click", () => {
  clearInterval(guideTimer);

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  stream = null;
  $("video").srcObject = null;
  $("cameraPanel").classList.remove("open");
  $("nextBtn").scrollIntoView({ behavior: "smooth" });
});

renderButtons();
renderCraft();
