let topics = [];
let currentTopic = "";
let mode = "all";

let votes = {
  guilty: 0,
  notGuilty: 0
};

let repChoice = null;

function startCourt() {
  topics = document.getElementById("topicInput").value
    .split("\n")
    .map(t => t.trim())
    .filter(t => t !== "");

  if (topics.length === 0) {
    alert("お題を入力してください");
    return;
  }

  const topicMode = document.querySelector('input[name="topicMode"]:checked').value;
  mode = document.querySelector('input[name="voteMode"]:checked').value;

  currentTopic = topicMode === "random"
    ? topics[Math.floor(Math.random() * topics.length)]
    : topics[0];

  document.getElementById("topic").textContent = currentTopic;

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("court").classList.remove("hidden");
}

function vote(type) {
  if (mode === "all") {
    votes[type]++;
  } else {
    repChoice = type;
  }
}

function showResult() {
  document.getElementById("court").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const resultText = document.getElementById("resultText");

  if (mode === "all") {
    resultText.textContent =
      `有罪：${votes.guilty}票 ／ 無罪：${votes.notGuilty}票`;
    resultText.className = votes.guilty > votes.notGuilty ? "guilty" : "notGuilty";
  } else {
    resultText.textContent =
      `判決：${repChoice === "guilty" ? "有罪" : "無罪"}`;
    resultText.className = repChoice;
  }
}

function resetCourt() {
  votes = { guilty: 0, notGuilty: 0 };
  repChoice = null;

  document.getElementById("result").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}
