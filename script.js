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
const guiltyImages = [
  "image/guilty1.png",
  "image/guilty2.png",
  "image/1.png",
  "image/2.png",
  "image/3.png"
];

const innocentImages = [
  "image/innocence1.png",
  "image/innocence2.png"
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

  // 有罪率計算（0票対策）
  const guiltyPercent =
    total === 0 ? 0 : Math.round((votes.guilty / total) * 100);

  // 表示
  document.getElementById("voteSummary").textContent =
    `有罪 ${guiltyPercent}％`;

  const isGuilty = guiltyPercent >= 50;
  const resultText = document.getElementById("resultText");

  resultText.textContent = `判決：${isGuilty ? "有罪" : "無罪"}`;
  resultText.className = isGuilty ? "guilty" : "notGuilty";

  // 背景画像をランダム設定
  const bg = document.getElementById("resultBg");
  const images = isGuilty ? guiltyImages : innocentImages;
  const img = images[Math.floor(Math.random() * images.length)];
  bg.style.backgroundImage = `url(${img})`;

  // 画面切り替え
  document.getElementById("court").classList.add("hidden");
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
  document.getElementById("setup").classList.remove("hidden");
}