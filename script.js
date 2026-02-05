/* =====================================================
   KD魔女裁判 - script.js
   ・各自投票（匿名）
   ・合計投票数のみ表示
   ・最終判決は「有罪◯％」で演出
   ===================================================== */

/* ===== ランダムお題（事前設定） ===== */
const presetTopics = [
  "〇〇が遅刻したことは罪か？",
  "課題をギリギリまでやらないのは罪か？",
  "授業中に寝るのは有罪？",
  "GitHubの使い方を忘れるのは罪？",
  "友達に宿題を手伝ってもらうことは罪か？",
  "スマホをいじりながら授業を受けるのは罪か？",
  "連絡を無視するのは罪か？",
  "学生証を忘れるのは罪か？",
  "ゴミを捨て忘れるのは罪か？",
  "リモート報告を怠るのは罪か？"
];

/* ===== 判決背景画像 ===== */
/** 有罪率100%のときのみ使用（guilty1 or guilty2 をランダム） */
const guilty100Images = [
  "image/guilty1.jpg",
  "image/guilty2.jpg"
];

const guiltyImages = [
  "image/1.jpg",
  "image/2.jpg",
  "image/3.jpg"
];

const innocentImages = [
  "image/innocence1.jpg",
  "image/innocence2.jpg"
];

/* ===== 投票数管理 ===== */
let votes = {
  guilty: 0,
  notGuilty: 0
};

/* -----------------------------------------------------
   お題をランダム設定
   ・現在入力されているお題は除外する
   ----------------------------------------------------- */
function setRandomTopic() {
  const current = document.getElementById("topicInput").value.trim();
  const candidates = presetTopics.filter(t => t !== current);

  const random =
    candidates[Math.floor(Math.random() * candidates.length)];

  document.getElementById("topicInput").value = random;
}

/* -----------------------------------------------------
   裁判開始
   ----------------------------------------------------- */
function startCourt() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) {
    alert("お題を入力してください");
    return;
  }

  // 投票リセット
  votes = { guilty: 0, notGuilty: 0 };

  // お題表示
  document.getElementById("topic").textContent = topic;
  updateTotalCount();

  // 画面切り替え
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("court").classList.remove("hidden");
}

/* -----------------------------------------------------
   投票処理（匿名）
   ----------------------------------------------------- */
function vote(type) {
  votes[type]++;
  updateTotalCount();
}

/* -----------------------------------------------------
   合計投票数のみ更新
   ----------------------------------------------------- */
function updateTotalCount() {
  const total = votes.guilty + votes.notGuilty;
  document.getElementById("totalCount").textContent = total;
}

/* -----------------------------------------------------
   判決表示
   ・有罪％のみ表示
   ・50％以上で有罪
   ----------------------------------------------------- */
function showResult() {
  const total = votes.guilty + votes.notGuilty;

  if (total === 0) {
    alert("投票しやがれ");
    return;
  }

  // 有罪率計算（0票対策）
  const guiltyPercent =
    total === 0 ? 0 : Math.round((votes.guilty / total) * 100);

  // 表示
  document.getElementById("voteSummary").textContent =
    `有罪 ${guiltyPercent}％`;

  const isGuilty = guiltyPercent >= 50;
  const verdictWord = isGuilty ? "有罪" : "無罪";
  const resultText = document.getElementById("resultText");

  resultText.innerHTML = "";
  resultText.className = "verdict-letters " + (isGuilty ? "guilty" : "notGuilty");

  // 「判決」を一文字ずつ落下
  const verdictLabel = document.getElementById("verdictLabel");
  verdictLabel.innerHTML = "";
  "判決".split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "label-letter";
    span.textContent = char;
    span.style.animationDelay = `${i * 0.1}s`;
    verdictLabel.appendChild(span);
  });

  // 「有罪」「無罪」を一文字ずつ落下（判決の後に少し遅れて開始）
  const labelDelay = 0.25; // 判決アニメ後に余裕
  verdictWord.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "verdict-letter";
    span.textContent = char;
    span.style.animationDelay = `${labelDelay + i * 0.9}s`;
    resultText.appendChild(span);
  });

  // 背景画像をパネルより後ろの全画面レイヤーに設定（有罪100%のときは guilty1 or guilty2 のみ）
  const pageBg = document.getElementById("resultPageBg");
  const images = isGuilty
    ? (guiltyPercent === 100 ? guilty100Images : guiltyImages)
    : innocentImages;
  const img = images[Math.floor(Math.random() * images.length)];
  pageBg.style.backgroundImage = `url(${img})`;

  // 画面切り替え
  document.getElementById("court").classList.add("hidden");
  document.getElementById("resultPageBg").classList.remove("hidden");
  document.getElementById("result").classList.remove("hidden");
}

/* -----------------------------------------------------
   戻る（裁判画面 → 設定画面）
   ----------------------------------------------------- */
function backToSetup() {
  votes = { guilty: 0, notGuilty: 0 };
  document.getElementById("court").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}

/* -----------------------------------------------------
   次の裁判へ
   ----------------------------------------------------- */
function resetCourt() {
  votes = { guilty: 0, notGuilty: 0 };
  document.getElementById("result").classList.add("hidden");
  document.getElementById("resultPageBg").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}