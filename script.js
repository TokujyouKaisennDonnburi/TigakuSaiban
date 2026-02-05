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

/* ===== 判決背景画像（有罪率ごと） ===== */
/** 有罪率100% → guilty1 or guilty2 */
const guilty100Images = [
  "image/guilty1.jpg",
  "image/guilty2.jpg"
];
/** 有罪率99〜75% → 1.jpg */
const guilty99to75Images = ["image/1.jpg"];
/** 有罪率74〜50% → 2.jpg */
const guilty74to50Images = ["image/2.jpg"];
/** 有罪率49〜25% → 3.jpg */
const guilty49to25Images = ["image/3.jpg"];
/** 有罪率24〜1% → 4.jpg */
const guilty24to1Images = ["image/4.jpg"];
/** 有罪率0% → innocence1 or innocence2 */
const innocentImages = [
  "image/innocence1.jpg",
  "image/innocence2.jpg"
];

/* ===== 判決文言（有罪率ごと・100%に近いほど重い） ===== */
/** 有罪率100% */
const verdict100 = "極刑だ！";
/** 有罪率99〜75% */
const verdict99to75 = "退学だ！出ていけ！";
/** 有罪率74〜50% */
const verdict74to50 = "停学だ！大人しくしてろ！";
/** 有罪率49〜25% */
const verdict49to25 = "謹慎を命ずる";
/** 有罪率24〜1% */
const verdict24to1 = "パンチ一発で許そう";
/** 有罪率0% */
const verdict0 = "これからも励むが良い。";

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

  // 「有罪」「無罪」を一文字ずつ落下
  const labelDelay = 0;
  verdictWord.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "verdict-letter";
    span.textContent = char;
    span.style.animationDelay = `${labelDelay + i * 0.9}s`;
    resultText.appendChild(span);
  });

  // 背景画像・判決文言を有罪率に応じて選択（同じ範囲で分ける）
  const pageBg = document.getElementById("resultPageBg");
  let images, verdictMessage;
  if (guiltyPercent === 100) {
    images = guilty100Images;
    verdictMessage = verdict100;
  } else if (guiltyPercent >= 75) {
    images = guilty99to75Images;
    verdictMessage = verdict99to75;
  } else if (guiltyPercent >= 50) {
    images = guilty74to50Images;
    verdictMessage = verdict74to50;
  } else if (guiltyPercent >= 25) {
    images = guilty49to25Images;
    verdictMessage = verdict49to25;
  } else if (guiltyPercent >= 1) {
    images = guilty24to1Images;
    verdictMessage = verdict24to1;
  } else {
    images = innocentImages;
    verdictMessage = verdict0;
  }
  const img = images[Math.floor(Math.random() * images.length)];
  pageBg.style.backgroundImage = `url(${img})`;
  document.getElementById("verdictSpeechText").textContent = verdictMessage;

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