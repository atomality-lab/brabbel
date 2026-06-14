const DEFAULT_BOARD_SIZE = 9;
const RACK_SIZE = 7;
const JOKER_TILE = "★";
const JOKER_CHOICES = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","S","T","U","V","W","X","Y","Z","Ä","Ö","Ü","ß","QU"];

const CLASSIC_BAGS = {
  9: {"E":10,"N":6,"I":4,"S":4,"R":4,"A":4,"T":3,"H":3,"D":3,"U":2,"L":2,"G":2,"C":1,"M":1,"O":1,"B":1,"W":1,"F":1,"K":1,"P":1,"V":1,"Z":1,"Ä":1,"Ö":1,"Ü":1,"ß":1,"QU":1,"★":1},
  11: {"E":10,"N":5,"I":5,"S":5,"R":5,"A":4,"T":4,"H":3,"D":4,"U":3,"L":3,"C":2,"G":2,"M":2,"O":2,"B":2,"W":1,"F":1,"K":1,"P":1,"V":1,"Z":1,"Ä":1,"Ö":1,"Ü":1,"ß":1,"QU":1,"J":1,"X":1,"Y":1,"★":2},
  13: {"E":12,"N":7,"I":6,"S":6,"R":6,"A":5,"T":4,"H":4,"D":4,"U":4,"L":3,"C":2,"G":2,"M":2,"O":2,"B":2,"W":2,"F":2,"K":2,"P":2,"V":2,"Z":1,"Ä":1,"Ö":1,"Ü":1,"ß":1,"QU":1,"J":1,"X":1,"Y":1,"★":1}
};
const VOWELS = ["A", "E", "I", "O", "U", "Ä", "Ö", "Ü"];
const PRAISES = ["Gut gemacht!", "Schön gelegt!", "Starker Zug!", "Prima gewandelt!", "Das sitzt!", "Feine Wortarbeit!"];

const LETTER_WEIGHTS = [
  ["E",174],["N",98],["I",75],["S",73],["R",70],["A",65],["T",61],["H",55],["D",51],["U",41],
  ["L",34],["C",30],["G",30],["M",25],["B",19],["V",19],["W",19],["K",15],["P",8],["Z",3],["Ö",3],["Ä",6],["Ü",6],
  ["ß",4],["QU",2],["★",2],["X",1],["Y",1],["J",1]
];

const LETTER_POINTS = {
  "E":1, "N":1, "I":1, "S":1, "R":1, "A":1, "T":1, "D":1, "H":1,
  "U":2, "L":2, "C":2, "G":2, "M":2, "O":2,
  "B":3, "W":3, "F":3, "K":3,
  "Z":4, "P":4, "V":4, "Ä":4,
  "Ö":5, "Ü":5,
  "J":6, "X":6, "QU":6,
  "Y":8, "ß":8, "★":0
};

function isJokerTile(tile) {
  return tile === JOKER_TILE;
}
function getTilePoints(tile) {
  if (isJokerTile(tile)) return 0;
  return LETTER_POINTS[tile] || 1;
}
function getCellTilePoints(cell) {
  if (!cell || cell.joker) return 0;
  return getTilePoints(cell.letter);
}
function displayTile(tile) {
  return isJokerTile(tile) ? "★" : tile;
}
function formatCellLetter(cell) {
  return cell?.joker ? `${cell.letter}★` : cell?.letter || "";
}

function getWordLengthBonus(length) {
  if (length >= 9) return 20;
  if (length === 8) return 16;
  if (length === 7) return 12;
  if (length === 6) return 6;
  if (length === 5) return 3;
  return 0;
}

function getComboBonus(wordCount) {
  if (wordCount >= 5) return 15;
  if (wordCount === 4) return 10;
  if (wordCount === 3) return 5;
  if (wordCount === 2) return 2;
  return 0;
}

function getBoardSize() {
  return Number(state?.boardSize || DEFAULT_BOARD_SIZE);
}
function getCenterIndex(size=getBoardSize()) {
  return Math.floor(size / 2) * size + Math.floor(size / 2);
}
function getBagTotal(size) {
  const bag = CLASSIC_BAGS[size] || CLASSIC_BAGS[DEFAULT_BOARD_SIZE];
  return Object.values(bag).reduce((a,b) => a + b, 0);
}
function createClassicBag(size) {
  const conf = CLASSIC_BAGS[size] || CLASSIC_BAGS[DEFAULT_BOARD_SIZE];
  const bag = [];
  Object.entries(conf).forEach(([tile, count]) => {
    for (let i = 0; i < count; i++) bag.push(tile);
  });
  return shuffleArray(bag);
}
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function countTiles(rack, predicate) {
  return rack.filter(Boolean).filter(predicate).length;
}
function drawTileFromBag(prefer) {
  if (!state?.bag?.length) return "";
  let candidates = state.bag.map((tile, idx) => ({tile, idx}));
  if (prefer === "vowel") candidates = candidates.filter(x => isVowelTile(x.tile));
  if (prefer === "consonant") candidates = candidates.filter(x => !isVowelTile(x.tile));
  if (!candidates.length) candidates = state.bag.map((tile, idx) => ({tile, idx}));
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const [tile] = state.bag.splice(pick.idx, 1);
  return tile;
}
function drawRackFromBag(existing) {
  const rack = existing.filter(Boolean).slice(0, RACK_SIZE);
  while (rack.length < RACK_SIZE && state?.bag?.length) {
    const remainingSlots = RACK_SIZE - rack.length;
    const vowels = countTiles(rack, isVowelTile);
    const consonants = rack.filter(t => t && !isVowelTile(t) && !isJokerTile(t)).length;
    let prefer = "any";
    if (consonants < 2 && remainingSlots <= (2 - consonants)) prefer = "consonant";
    else if (vowels < 1 && remainingSlots <= 1) prefer = "vowel";
    else if (vowels >= 4) prefer = "consonant";
    rack.push(drawTileFromBag(prefer));
  }
  return rack;
}
function describeBoardMode(mode) {
  if (mode === "letters") return "Mit Buchstaben";
  if (mode === "special") return "Mit Sonderfeldern";
  return "Leeres Brett";
}
function describeEndMode() {
  if (!state) return "";
  if (state.endMode === "rounds") return `Runden ${Math.min(state.round, state.roundLimit)} / ${state.roundLimit}`;
  if (state.endMode === "classic") return `Klassisch · ${state.bag?.length || 0} Steine im Beutel`;
  return "Endlos";
}
function isClassicGame() {
  return state?.endMode === "classic";
}



const K = {
  player: "wortwandler_player",
  slots: "wortwandler_slots_v2",
  leaderboard: "wortwandler_leaderboard_v2",
  lexicon: "wortwandler_personal_lexicon_v2",
  animations: "wortwandler_animations_enabled_v44",
  twoFingerCommit: "wortwandler_two_finger_commit_v518",
  infoPanelCollapsed: "wortwandler_info_panel_collapsed_v518",
  autosave: "brabbel_autosave_v529"
};

let state = null;
let selectedRackIndex = null;
let rackDragIndex = null;
let rackPointerState = null;
let boardPointerState = null;
let suppressBoardClick = false;
let suppressRackClick = false;
let lastTwoFingerCommitAt = 0;
const storedInfoPanelCollapsed = localStorage.getItem(K.infoPanelCollapsed);
let infoPanelCollapsed = storedInfoPanelCollapsed === null ? true : storedInfoPanelCollapsed === "true";
let pendingUnknownWords = [];
let confirmAction = null;

const $ = id => document.getElementById(id);

function normalizeWord(w) {
  return (w || "").toUpperCase()
    .replaceAll("Ä", "AE").replaceAll("Ö", "OE").replaceAll("Ü", "UE")
    .replaceAll("ẞ", "SS").replaceAll("ß", "SS")
    .replace(/[^A-Z]/g, "");
}

const BASE_WORDS = new Set(BASE_WORDS_RAW.map(normalizeWord));

function getPersonalLexicon() {
  try { return new Set(JSON.parse(localStorage.getItem(K.lexicon) || "[]")); }
  catch { return new Set(); }
}
function savePersonalLexicon(s) { localStorage.setItem(K.lexicon, JSON.stringify([...s].sort())); }
function isWordKnown(w) {
  const n = normalizeWord(w);
  return BASE_WORDS.has(n) || getPersonalLexicon().has(n);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  requestAnimationFrame(() => {
    window.scrollTo({top: 0, left: 0, behavior: "auto"});
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
  if (id === "screen-menu") updateMenu();
  if (id === "screen-slots") renderSlots();
  if (id === "screen-save") renderSaveSlots();
  if (id === "screen-leaderboard") renderLeaderboard();
  if (id === "screen-lexicon") renderLexicon();
  if (id === "screen-settings") renderSettings();
}
function message(t, x) {
  $("messageTitle").textContent = t;
  $("messageText").textContent = x;
  $("messageDialog").showModal();
}
function confirmDialog(title, text, yesText, action, noText) {
  confirmAction = action;
  const titleEl = $("confirmTitle");
  titleEl.textContent = title || "";
  titleEl.hidden = !title;
  $("confirmText").textContent = text;
  $("confirmYesBtn").textContent = yesText || "Ja";
  $("confirmNoBtn").textContent = noText || "Nein";
  $("confirmDialog").showModal();
}
function updateMenu() {
  const p = localStorage.getItem(K.player) || "Spieler";
  $("helloLine").textContent = `Hallo ${p}. Bereit für eine Runde Brabbel?`;
}

function init() {
  localStorage.getItem(K.player) ? showScreen("screen-menu") : showScreen("screen-welcome");
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showScreen(b.dataset.go)));
  $("savePlayerBtn").addEventListener("click", () => {
    localStorage.setItem(K.player, $("playerNameInput").value.trim() || "Spieler");
    showScreen("screen-menu");
  });
  $("newGameMenuBtn").addEventListener("click", () => showScreen("screen-newgame"));
  $("continueMenuBtn").addEventListener("click", () => showScreen("screen-slots"));
  $("leaderboardMenuBtn").addEventListener("click", () => showScreen("screen-leaderboard"));
  $("lexiconMenuBtn").addEventListener("click", () => showScreen("screen-lexicon"));
  $("settingsMenuBtn").addEventListener("click", () => showScreen("screen-settings"));
  $("exitAppBtn").addEventListener("click", exitApp);
  $("gameModeSelect").addEventListener("change", updateNewGameUi);
  $("endModeSelect").addEventListener("change", updateNewGameUi);
  $("boardSizeSelect").addEventListener("change", updateNewGameUi);
  $("startGameBtn").addEventListener("click", startNewGame);
  $("commitMoveBtn").addEventListener("click", commitMove);
  $("passBtn").addEventListener("click", passTurn);
  $("undoBtn").addEventListener("click", undoTurn);
  $("toggleInfoPanelBtn").addEventListener("click", toggleInfoPanel);
  $("board").addEventListener("touchstart", handleTwoFingerBoardTap, {passive:false});
  $("saveGameBtn").onclick = () => showScreen("screen-save");
  $("endGameBtn").onclick = endGame;
  $("giveUpBtn").onclick = giveUpGame;
  $("sortAlphaBtn").addEventListener("click", () => sortRack("alpha"));
  $("sortPointsBtn").addEventListener("click", () => sortRack("points"));
  $("sortVowelsBtn").addEventListener("click", () => sortRack("vowels"));
  $("shuffleRackBtn").addEventListener("click", shuffleRack);
  $("verifyYesBtn").onclick = window.wwAcceptUnknownWord;
  $("verifyNoBtn").onclick = window.wwRejectUnknownWord;
  $("messageOkBtn").addEventListener("click", () => $("messageDialog").close());
  $("jokerOkBtn").addEventListener("click", confirmJokerLetter);
  $("jokerCancelBtn").addEventListener("click", cancelJokerLetter);
  $("jokerInput").addEventListener("keydown", event => { if (event.key === "Enter") confirmJokerLetter(); });
  $("jokerInput").addEventListener("focus", event => event.target.blur());
  $("addLexiconBtn").addEventListener("click", addLexiconWord);
  $("lexiconSearchInput").addEventListener("input", renderLexicon);
  $("exportLexiconBtn").addEventListener("click", exportLexicon);
  $("importLexiconInput").addEventListener("change", importLexicon);
  $("saveSettingsBtn").addEventListener("click", saveSettings);
  applyAnimationSetting();
  applyInfoPanelSetting();
  updateNewGameUi();
  $("confirmNoBtn").onclick = window.wwConfirmNo;
  $("confirmYesBtn").onclick = window.wwConfirmYes;
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
}


function getSelectedSpecialLayoutType() {
  const picked = document.querySelector('input[name="specialLayout"]:checked');
  return picked ? picked.value : "x";
}
function updateNewGameUi() {
  const gameMode = $("gameModeSelect").value;
  $("seedCountWrap").classList.toggle("hidden", gameMode !== "letters");
  $("specialLayoutWrap").classList.toggle("hidden", gameMode !== "special");
  $("roundLimitWrap").classList.toggle("hidden", $("endModeSelect").value !== "rounds");
}
function buildSpecialLayoutSets(size, kind) {
  const sets = {TW:new Set(), DW:new Set(), TL:new Set(), DL:new Set()};
  const add = (type, coords) => coords.forEach(([r,c]) => sets[type].add(`${r},${c}`));
  const layouts = {
    9: {
      x: {TW:[[0,0],[0,8],[8,0],[8,8]], DL:[[1,1],[1,7],[7,1],[7,7]], DW:[[2,2],[2,6],[6,2],[6,6]], TL:[[3,3],[3,5],[5,3],[5,5]]},
      star: {TW:[[0,0],[0,4],[0,8],[4,0],[4,8],[8,0],[8,4],[8,8]], DL:[[1,1],[1,7],[2,4],[6,4],[7,1],[7,7]], DW:[[2,2],[2,6],[6,2],[6,6]], TL:[[3,3],[3,5],[4,2],[4,6],[5,3],[5,5]]},
      concentric: {TW:[[0,0],[0,4],[0,8],[4,0],[4,8],[8,0],[8,4],[8,8]], DL:[[0,2],[0,6],[2,0],[2,8],[4,2],[4,6],[6,0],[6,8],[8,2],[8,6]], DW:[[2,2],[2,6],[6,2],[6,6]], TL:[[2,4],[4,4],[6,4]]}
    },
    11: {
      x: {TW:[[0,0],[0,10],[10,0],[10,10]], DL:[[1,1],[1,9],[4,4],[4,6],[6,4],[6,6],[9,1],[9,9]], DW:[[2,2],[2,8],[8,2],[8,8]], TL:[[3,3],[3,7],[7,3],[7,7]]},
      star: {TW:[[0,0],[0,5],[0,10],[5,0],[5,10],[10,0],[10,5],[10,10]], DL:[[1,1],[1,9],[2,5],[4,4],[4,6],[6,4],[6,6],[8,5],[9,1],[9,9]], DW:[[2,2],[2,8],[8,2],[8,8]], TL:[[3,3],[3,7],[5,2],[5,8],[7,3],[7,7]]},
      concentric: {TW:[[0,0],[0,5],[0,10],[5,0],[5,10],[10,0],[10,5],[10,10]], DL:[[0,3],[0,7],[2,0],[2,10],[4,3],[4,7],[6,3],[6,7],[8,0],[8,10],[10,3],[10,7]], DW:[[2,3],[2,7],[8,3],[8,7]], TL:[[2,5],[8,5]]}
    },
    13: {
      x: {TW:[[0,0],[0,12],[12,0],[12,12]], DL:[[1,1],[1,11],[4,4],[4,8],[5,5],[5,7],[7,5],[7,7],[8,4],[8,8],[11,1],[11,11]], DW:[[2,2],[2,10],[10,2],[10,10]], TL:[[3,3],[3,9],[9,3],[9,9]]},
      star: {TW:[[0,0],[0,6],[0,12],[6,0],[6,12],[12,0],[12,6],[12,12]], DL:[[1,1],[1,11],[2,6],[4,4],[4,8],[5,5],[5,7],[6,2],[6,10],[7,5],[7,7],[8,4],[8,8],[10,6],[11,1],[11,11]], DW:[[2,2],[2,10],[10,2],[10,10]], TL:[[3,3],[3,9],[4,6],[6,4],[6,8],[8,6],[9,3],[9,9]]},
      concentric: {TW:[[0,0],[0,6],[0,12],[6,0],[6,12],[12,0],[12,6],[12,12]], DL:[[0,3],[0,9],[2,4],[2,8],[3,0],[3,12],[4,2],[4,4],[4,6],[4,8],[4,10],[6,4],[6,8],[8,2],[8,4],[8,6],[8,8],[8,10],[9,0],[9,12],[10,4],[10,8],[12,3],[12,9]], DW:[[2,2],[2,10],[10,2],[10,10]], TL:[[2,6],[6,2],[6,10],[10,6]]}
    }
  };
  const chosen = layouts[size]?.[kind];
  if (!chosen) return sets;
  add('TW', chosen.TW || []); add('DW', chosen.DW || []); add('TL', chosen.TL || []); add('DL', chosen.DL || []);
  return sets;
}
function areTouching(a,b){return Math.max(Math.abs(a[0]-b[0]), Math.abs(a[1]-b[1])) <= 1;}
function createRandomSpecialLayout(size) {
  const counts = size === 9 ? {TW:4, DL:5, DW:4, TL:5} : size === 11 ? {TW:5, DL:6, DW:5, TL:6} : {TW:6, DL:7, DW:6, TL:7};
  const sets = {TW:new Set(), DW:new Set(), TL:new Set(), DL:new Set()};
  const placedWord = [];
  const center = Math.floor(size/2);
  const all = [];
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) if (!(r===center && c===center)) all.push([r,c]);
  const pick = (predicate) => {
    const candidates = all.filter(([r,c]) => {
      const key = `${r},${c}`;
      if (sets.TW.has(key) || sets.DW.has(key) || sets.TL.has(key) || sets.DL.has(key)) return false;
      return predicate(r,c);
    });
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  for (const type of ['TW','DW']) {
    for (let i=0;i<counts[type];i++) {
      let coord = null; let tries = 0;
      while (!coord && tries < 500) { tries++; coord = pick((r,c) => !placedWord.some(([rr,cc]) => areTouching([r,c],[rr,cc]))); }
      if (!coord) break;
      const [r,c] = coord; sets[type].add(`${r},${c}`); placedWord.push([r,c]);
    }
  }
  for (const type of ['DL','TL']) {
    for (let i=0;i<counts[type];i++) {
      const coord = pick(() => true);
      if (!coord) break;
      sets[type].add(`${coord[0]},${coord[1]}`);
    }
  }
  return sets;
}

function exitApp() {
  window.close();
  message("App beenden", "Falls die App nicht automatisch schließt, nutze bitte die Zurück-Taste oder schließe den Browser-Tab.");
}
function getSpecialBonusForIndex(index, size) {
  if (state?.mode !== "special") return "";
  const r = Math.floor(index / size), c = index % size;
  const key = `${r},${c}`;
  const kind = state?.specialLayoutType || getSelectedSpecialLayoutType();
  const sets = kind === "random" ? (state?.specialLayoutData || createRandomSpecialLayout(size)) : buildSpecialLayoutSets(size, kind);
  if (sets.TW.has(key)) return "TW";
  if (sets.DW.has(key)) return "DW";
  if (sets.TL.has(key)) return "TL";
  if (sets.DL.has(key)) return "DL";
  return "";
}
function emptyBoard(size=getBoardSize()) {
  const center = getCenterIndex(size);
  return Array.from({length: size * size}, (_, i) => ({
    letter: "", previousLetter: "", isNew: false, isReplacement: false, center: i === center,
    bonus: getSpecialBonusForIndex(i, size), bonusUsed: false, joker: false, previousJoker: false, settled: false
  }));
}
function startNewGame() {
  const mode = $("gameModeSelect").value;
  const boardSize = clamp(Number($("boardSizeSelect").value) || DEFAULT_BOARD_SIZE, 9, 13);
  const endMode = $("endModeSelect").value;
  const roundLimit = clamp(Number($("roundLimitInput").value) || 30, 10, 100);
  const specialLayoutType = mode === "special" ? getSelectedSpecialLayoutType() : "";
  state = {
    player: localStorage.getItem(K.player) || "Spieler",
    mode, boardSize, endMode, roundLimit, specialLayoutType,
    score: 0, round: 1, firstSuccessfulMove: false,
    board: [], rack: [], bag: endMode === "classic" ? createClassicBag(boardSize) : null,
    lastMove: null, startedAt: new Date().toISOString(), savedAt: null,
    specialLayoutData: null,
    stats: createEmptyStats()
  };
  if (mode === "special" && specialLayoutType === "random") state.specialLayoutData = createRandomSpecialLayout(boardSize);
  state.board = emptyBoard(boardSize);
  if (mode === "letters") {
    placeSeedLetters(clamp(Number($("seedCountInput").value) || 5, 2, 10));
    state.firstSuccessfulMove = true;
  }
  state.rack = drawRack([], true);
  selectedRackIndex = null;
  showScreen("screen-game");
  renderGame();
  saveAutosave();
}
function placeSeedLetters(count) {
  let placed = 0, guard = 0;
  while (placed < count && guard < 1000) {
    guard++;
    const idx = Math.floor(Math.random() * state.board.length);
    if (state.board[idx].letter) continue;
    if (neighbors(idx).some(n => state.board[n]?.letter)) continue;
    state.board[idx].letter = isClassicGame() ? drawTileFromBag("any") : drawLetterWithLimits([]);
    placed++;
  }
}
function isVowelTile(tile) {
  return VOWELS.includes(tile);
}

function isValidRackDistribution(rack) {
  const filled = rack.filter(Boolean);
  if (filled.length < RACK_SIZE) return true;
  const vowels = filled.filter(isVowelTile).length;
  const consonants = filled.filter(t => t && !isVowelTile(t) && !isJokerTile(t)).length;
  const counts = {};
  for (const tile of filled) counts[tile] = (counts[tile] || 0) + 1;
  const maxSame = Math.max(...Object.values(counts));
  return vowels >= 1 && consonants >= 2 && vowels <= 4 && maxSame <= 3;
}

function drawRack(existing, req=false) {
  if (isClassicGame()) return drawRackFromBag(existing);
  const fixed = existing.filter(Boolean).slice(0, RACK_SIZE);

  for (let attempt = 0; attempt < 800; attempt++) {
    const rack = fixed.slice();
    let guard = 0;
    while (rack.length < RACK_SIZE && guard < 500) {
      guard++;
      rack.push(drawLetterWithLimits(rack));
    }
    if (isValidRackDistribution(rack)) return rack;
  }

  const rack = fixed.slice();
  while (rack.length < RACK_SIZE) {
    const vowels = rack.filter(isVowelTile).length;
    const consonants = rack.length - vowels;
    let next;
    if (consonants < 2) next = drawConsonantWithLimits(rack);
    else if (vowels < 1) next = drawVowelWithLimits(rack);
    else if (vowels >= 4) next = drawConsonantWithLimits(rack);
    else next = drawLetterWithLimits(rack);
    rack.push(next);
  }
  return rack;
}

function drawVowelWithLimits(rack) {
  for (let i = 0; i < 100; i++) {
    const l = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    if (rack.filter(x => x === l).length < 3) return l;
  }
  return "E";
}

function drawConsonantWithLimits(rack) {
  for (let i = 0; i < 200; i++) {
    const l = weightedChoice();
    if (isVowelTile(l)) continue;
    if (rack.filter(x => x === l).length < 3) return l;
  }
  return "N";
}
function drawLetterWithLimits(rack) {
  let g = 0;
  while (g < 200) {
    g++;
    const l = weightedChoice();
    if (rack.filter(x => x === l).length < 3) return l;
  }
  return "E";
}
function weightedChoice() {
  let total = LETTER_WEIGHTS.reduce((s, [,w]) => s + w, 0), r = Math.random() * total;
  for (const [l, w] of LETTER_WEIGHTS) {
    r -= w;
    if (r <= 0) return l;
  }
  return "E";
}

function renderGame() {
  if (!state) return;
  $("scoreOut").textContent = state.score;
  $("roundOut").textContent = state.round;
  $("gameSubtitle").textContent = `${describeBoardMode(state.mode)} · ${getBoardSize()}×${getBoardSize()} · ${describeEndMode()}`;
  const giveUpAvailable = isGiveUpAvailable();
  $("giveUpBtn")?.classList.toggle("hidden", !giveUpAvailable);
  $("bottomGameControls")?.classList.toggle("hasGiveUp", giveUpAvailable);
  renderBoard(); renderRack(); renderTurnStatus(); renderPreview(); renderLastMove();
}
function getRoundStatusText() {
  if (!state) return "–";
  if (state.endMode === "rounds") return `${Math.min(state.round, state.roundLimit)}/${state.roundLimit}`;
  return `${state.round}`;
}

function getBagStatusText() {
  if (!state || state.endMode !== "classic") return "–";
  return `${state.bag?.length || 0}/${getBagTotal(getBoardSize())}`;
}

function getMoveStatus(p) {
  if (!p || !p.changedCells || !p.changedCells.length) return "empty";
  const realErrors = (p.errors || []).filter(e => !String(e).startsWith("Wort nicht gefunden"));
  if (realErrors.length) return "error";
  if ((p.unknown || []).length) return "verify";
  return "valid";
}

function applyMoveStatus(p) {
  const box = $("currentMoveBox");
  const label = $("currentMoveLabel");
  if (!box || !label) return;
  const status = getMoveStatus(p);
  const labels = {empty: "Aktuell", valid: "Gültig", verify: "Prüfen", error: "Fehler"};
  box.classList.remove("moveStatus-empty", "moveStatus-valid", "moveStatus-verify", "moveStatus-error");
  box.classList.add(`moveStatus-${status}`);
  label.textContent = labels[status] || "Aktuell";
}

function renderTurnStatus() {
  if (!state) return;
  const p = analyzeMove();
  const current = p.changedCells.length && getMoveStatus(p) !== "error" ? p.points : 0;
  if ($("bagStatusOut")) $("bagStatusOut").textContent = getBagStatusText();
  if ($("currentMoveOut")) $("currentMoveOut").textContent = `${current} Pkt.`;
  if ($("totalScoreOut")) $("totalScoreOut").textContent = `${state.score} Pkt.`;
  if ($("roundStatusOut")) $("roundStatusOut").textContent = getRoundStatusText();
  applyMoveStatus(p);
}

function renderBoard() {
  const e = $("board");
  e.innerHTML = "";
  const size = getBoardSize();
  e.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
  e.classList.toggle("boardLarge", size >= 13);
  e.classList.toggle("boardMedium", size === 11);
  state.board.forEach((cell, idx) => {
    const b = document.createElement("button");
    b.className = "cell";
    if (cell.center) b.classList.add("center");
    if (cell.isNew) b.classList.add("new");
    if (cell.isReplacement) b.classList.add("replaced");
    if (cell.bonus) b.classList.add("bonus", `bonus-${cell.bonus.toLowerCase()}`);
    if (cell.bonusUsed) b.classList.add("bonusUsed");
    if (cell.joker) b.classList.add("jokerCell");
    if (cell.letter) b.classList.add("filled");
    if (cell.letter && cell.settled) b.classList.add("settled");
    if (selectedRackIndex !== null) b.classList.add("selectable");

    if (cell.letter) {
      const letter = document.createElement("span");
      letter.className = "tileLetter";
      letter.textContent = cell.letter;
      b.appendChild(letter);

      const points = document.createElement("span");
      points.className = "tilePoints";
      points.textContent = cell.joker ? 0 : getTilePoints(cell.letter);
      b.appendChild(points);

      if (cell.joker) {
        const mark = document.createElement("span");
        mark.className = "jokerMark";
        mark.textContent = "★";
        b.appendChild(mark);
      }
    } else if (cell.bonus) {
      const bonus = document.createElement("span");
      bonus.className = "bonusLabel";
      bonus.textContent = bonusLabel(cell.bonus);
      b.appendChild(bonus);
    }

    if (cell.isReplacement && cell.previousLetter) {
      const old = document.createElement("span");
      old.className = "old";
      old.textContent = cell.previousJoker ? `${cell.previousLetter}★` : cell.previousLetter;
      b.appendChild(old);
    }
    b.dataset.boardIndex = idx;
    b.addEventListener("dragover", event => {
      if (rackDragIndex !== null) {
        event.preventDefault();
        b.classList.add("dropTarget");
      }
    });
    b.addEventListener("dragleave", () => b.classList.remove("dropTarget"));
    b.addEventListener("drop", event => {
      event.preventDefault();
      b.classList.remove("dropTarget");
      const from = rackDragIndex ?? Number(event.dataTransfer?.getData("text/plain"));
      placeRackTileOnBoard(from, idx);
    });
    if (cell.isNew || cell.isReplacement) {
      b.classList.add("movableTurnTile");
      b.addEventListener("pointerdown", event => beginBoardPointer(event, idx));
      b.addEventListener("pointermove", moveBoardPointer);
      b.addEventListener("pointerup", endBoardPointer);
      b.addEventListener("pointercancel", cancelBoardPointer);
    }
    b.addEventListener("click", () => {
      if (suppressBoardClick) { suppressBoardClick = false; return; }
      boardClick(idx);
    });
    e.appendChild(b);
  });
}

function bonusLabel(type) {
  return ({DL:"2B", TL:"3B", DW:"2W", TW:"3W"})[type] || "";
}


function moveRackTile(from, to) {
  if (!state) return;
  from = Number(from); to = Number(to);
  if (!Number.isInteger(from) || !Number.isInteger(to)) return;
  if (from < 0 || from >= state.rack.length || to < 0 || to >= state.rack.length || from === to) return;
  if (!state.rack[from]) return;
  const rack = state.rack.slice();
  const [tile] = rack.splice(from, 1);
  rack.splice(to, 0, tile);
  state.rack = rack.slice(0, RACK_SIZE);
  selectedRackIndex = null;
  renderGame();
}

function rackTileAtPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  const tile = el && el.closest ? el.closest('.tile[data-rack-index]') : null;
  return tile ? Number(tile.dataset.rackIndex) : null;
}

function boardCellAtPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  const cell = el && el.closest ? el.closest('.cell[data-board-index]') : null;
  return cell ? Number(cell.dataset.boardIndex) : null;
}

function clearBoardDropTarget() {
  document.querySelectorAll('.cell.dropTarget').forEach(el => el.classList.remove('dropTarget'));
}

function markBoardDropTarget(index) {
  clearBoardDropTarget();
  if (index === null || index === undefined || Number.isNaN(Number(index))) return;
  document.querySelector(`.cell[data-board-index="${Number(index)}"]`)?.classList.add('dropTarget');
}

function removeRackDragGhost() {
  document.getElementById('rackDragGhost')?.remove();
}

function updateRackDragGhost(tile, x, y) {
  if (!tile) return;
  let ghost = document.getElementById('rackDragGhost');
  if (!ghost) {
    ghost = document.createElement('div');
    ghost.id = 'rackDragGhost';
    ghost.className = 'rackDragGhost';
    const letter = document.createElement('span');
    letter.className = 'tileLetter';
    ghost.appendChild(letter);
    const points = document.createElement('span');
    points.className = 'tilePoints';
    ghost.appendChild(points);
    document.body.appendChild(ghost);
  }
  ghost.querySelector('.tileLetter').textContent = displayTile(tile);
  ghost.querySelector('.tilePoints').textContent = getTilePoints(tile);
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}


function placeRackTileOnBoard(rackIndex, boardIndex) {
  if (!state) return;
  rackIndex = Number(rackIndex);
  boardIndex = Number(boardIndex);
  if (!Number.isInteger(rackIndex) || !Number.isInteger(boardIndex)) return;
  if (!state.rack[rackIndex]) return;
  selectedRackIndex = rackIndex;
  boardClick(boardIndex);
}

function updateBoardDragGhost(cell, x, y) {
  if (!cell || !cell.letter) return;
  let ghost = document.getElementById('rackDragGhost');
  if (!ghost) {
    ghost = document.createElement('div');
    ghost.id = 'rackDragGhost';
    ghost.className = 'rackDragGhost';
    const letter = document.createElement('span');
    letter.className = 'tileLetter';
    ghost.appendChild(letter);
    const points = document.createElement('span');
    points.className = 'tilePoints';
    ghost.appendChild(points);
    document.body.appendChild(ghost);
  }
  ghost.querySelector('.tileLetter').textContent = cell.letter;
  ghost.querySelector('.tilePoints').textContent = cell.joker ? 0 : getTilePoints(cell.letter);
  ghost.classList.toggle('jokerTile', !!cell.joker);
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}

function clearBoardTileDragging() {
  document.querySelectorAll('.cell.boardTileDragging').forEach(el => el.classList.remove('boardTileDragging'));
}

function restoreMovedSourceCell(cell) {
  if (cell.isReplacement) {
    cell.letter = cell.previousLetter;
    cell.joker = !!cell.previousJoker;
    cell.previousLetter = "";
    cell.previousJoker = false;
    cell.isReplacement = false;
    cell.isNew = false;
    cell.settled = true;
  } else {
    cell.letter = "";
    cell.joker = false;
    cell.previousLetter = "";
    cell.previousJoker = false;
    cell.isNew = false;
    cell.isReplacement = false;
    cell.settled = false;
  }
}

function moveBoardTile(fromIndex, toIndex) {
  if (!state) return;
  fromIndex = Number(fromIndex); toIndex = Number(toIndex);
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex) return;
  const source = state.board[fromIndex];
  const target = state.board[toIndex];
  if (!source || !target || !(source.isNew || source.isReplacement) || !source.letter) return;
  if (target.isNew || target.isReplacement) { message("Zielfeld belegt", "Dieses Feld wurde im aktuellen Zug bereits geändert."); return; }

  const movedLetter = source.letter;
  const movedJoker = !!source.joker;

  if (target.letter) {
    if (!state.firstSuccessfulMove) { message("Noch nicht möglich", "Buchstaben dürfen erst ab Runde 2 überlegt werden."); return; }
    if (target.letter === movedLetter) { message("Nicht erlaubt", "Ein Buchstabe darf nicht durch denselben Buchstaben ersetzt werden."); return; }
  }

  restoreMovedSourceCell(source);

  if (target.letter) {
    target.previousLetter = target.letter;
    target.previousJoker = !!target.joker;
    target.letter = movedLetter;
    target.joker = movedJoker;
    target.isReplacement = true;
    target.isNew = false;
  } else {
    target.letter = movedLetter;
    target.joker = movedJoker;
    target.settled = false;
    target.isNew = true;
    target.isReplacement = false;
    target.previousLetter = "";
    target.previousJoker = false;
  }

  selectedRackIndex = null;
  renderGame();
}

function beginBoardPointer(event, idx) {
  if (selectedRackIndex !== null) return;
  const cell = state?.board?.[idx];
  if (!cell || !(cell.isNew || cell.isReplacement) || !cell.letter) return;
  boardPointerState = {idx, x: event.clientX, y: event.clientY, moved: false, pointerId: event.pointerId};
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function moveBoardPointer(event) {
  if (!boardPointerState) return;
  const dx = Math.abs(event.clientX - boardPointerState.x);
  const dy = Math.abs(event.clientY - boardPointerState.y);
  if (dx + dy > 12) {
    boardPointerState.moved = true;
    document.body.classList.add('rackDragging', 'boardDragging');
    document.querySelector(`.cell[data-board-index="${boardPointerState.idx}"]`)?.classList.add('boardTileDragging');
    updateBoardDragGhost(state.board[boardPointerState.idx], event.clientX, event.clientY);
    const boardTarget = boardCellAtPoint(event.clientX, event.clientY);
    if (boardTarget !== null && boardTarget !== boardPointerState.idx) markBoardDropTarget(boardTarget);
    else clearBoardDropTarget();
    event.preventDefault();
  }
}

function endBoardPointer(event) {
  if (!boardPointerState) return;
  const drag = boardPointerState;
  boardPointerState = null;
  document.body.classList.remove('rackDragging', 'boardDragging');
  removeRackDragGhost();
  clearBoardDropTarget();
  clearBoardTileDragging();
  if (!drag.moved) return;
  suppressBoardClick = true;
  const boardTarget = boardCellAtPoint(event.clientX, event.clientY);
  if (boardTarget !== null && boardTarget !== drag.idx) moveBoardTile(drag.idx, boardTarget);
  setTimeout(() => { suppressBoardClick = false; }, 0);
  event.preventDefault();
}

function cancelBoardPointer() {
  boardPointerState = null;
  document.body.classList.remove('rackDragging', 'boardDragging');
  removeRackDragGhost();
  clearBoardDropTarget();
  clearBoardTileDragging();
}

function beginRackPointer(event, idx) {
  if (!state?.rack?.[idx]) return;
  rackPointerState = {idx, x: event.clientX, y: event.clientY, moved: false, pointerId: event.pointerId};
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function moveRackPointer(event) {
  if (!rackPointerState) return;
  const dx = Math.abs(event.clientX - rackPointerState.x);
  const dy = Math.abs(event.clientY - rackPointerState.y);
  if (dx + dy > 12) {
    rackPointerState.moved = true;
    document.body.classList.add('rackDragging');
    const tile = state?.rack?.[rackPointerState.idx];
    updateRackDragGhost(tile, event.clientX, event.clientY);
    const boardTarget = boardCellAtPoint(event.clientX, event.clientY);
    if (boardTarget !== null) markBoardDropTarget(boardTarget);
    else clearBoardDropTarget();
    event.preventDefault();
  }
}

function endRackPointer(event) {
  if (!rackPointerState) return;
  const drag = rackPointerState;
  rackPointerState = null;
  document.body.classList.remove('rackDragging');
  removeRackDragGhost();
  clearBoardDropTarget();
  if (!drag.moved) return;
  suppressRackClick = true;
  const boardTarget = boardCellAtPoint(event.clientX, event.clientY);
  if (boardTarget !== null) {
    placeRackTileOnBoard(drag.idx, boardTarget);
  } else {
    const target = rackTileAtPoint(event.clientX, event.clientY);
    if (target !== null) moveRackTile(drag.idx, target);
  }
  setTimeout(() => { suppressRackClick = false; }, 0);
  event.preventDefault();
}

function sortRack(mode) {
  if (!state) return;
  const letters = state.rack.filter(Boolean);
  const empties = Array.from({length: RACK_SIZE - letters.length}, () => "");
  const alpha = (a, b) => a.localeCompare(b, "de", {sensitivity: "base"});

  if (mode === "points") {
    letters.sort((a, b) => (getTilePoints(b) - getTilePoints(a)) || alpha(a, b));
  } else if (mode === "vowels") {
    letters.sort((a, b) => {
      const av = isVowelTile(a) ? 0 : 1;
      const bv = isVowelTile(b) ? 0 : 1;
      return (av - bv) || alpha(a, b);
    });
  } else {
    letters.sort(alpha);
  }

  state.rack = letters.concat(empties);
  selectedRackIndex = null;
  renderGame();
}

function shuffleRack() {
  if (!state) return;
  const letters = state.rack.filter(Boolean);
  const empties = Array.from({length: RACK_SIZE - letters.length}, () => "");
  if (letters.length < 2) return;
  let shuffled = letters.slice();
  for (let attempt = 0; attempt < 12; attempt++) {
    shuffled = shuffleArray(letters);
    if (shuffled.join("|") !== letters.join("|")) break;
  }
  state.rack = shuffled.concat(empties);
  selectedRackIndex = null;
  renderGame();
}

function renderRack() {
  const e = $("rack");
  e.innerHTML = "";
  state.rack.forEach((l, idx) => {
    const b = document.createElement("button");
    b.className = "tile";
    b.dataset.rackIndex = idx;
    if (selectedRackIndex === idx) b.classList.add("active");
    if (!l) b.classList.add("used");
    if (isJokerTile(l)) b.classList.add("jokerTile");

    if (l) {
      const letter = document.createElement("span");
      letter.className = "tileLetter";
      letter.textContent = displayTile(l);
      b.appendChild(letter);

      const points = document.createElement("span");
      points.className = "tilePoints";
      points.textContent = getTilePoints(l);
      b.appendChild(points);
    } else {
      b.textContent = " ";
    }

    b.disabled = !l;
    if (l) {
      b.draggable = true;
      b.addEventListener("dragstart", event => {
        rackDragIndex = idx;
        document.body.classList.add('rackDragging');
        b.classList.add("dragging");
        event.dataTransfer?.setData("text/plain", String(idx));
      });
      b.addEventListener("dragend", () => {
        rackDragIndex = null;
        document.body.classList.remove('rackDragging');
        b.classList.remove("dragging");
      });
      b.addEventListener("dragover", event => event.preventDefault());
      b.addEventListener("drop", event => {
        event.preventDefault();
        const from = rackDragIndex ?? Number(event.dataTransfer?.getData("text/plain"));
        moveRackTile(from, idx);
      });
      b.addEventListener("pointerdown", event => beginRackPointer(event, idx));
      b.addEventListener("pointermove", moveRackPointer);
      b.addEventListener("pointerup", endRackPointer);
      b.addEventListener("pointercancel", () => { rackPointerState = null; document.body.classList.remove('rackDragging'); removeRackDragGhost(); clearBoardDropTarget(); });
    }
    b.addEventListener("click", () => {
      if (suppressRackClick) { suppressRackClick = false; return; }
      selectedRackIndex = selectedRackIndex === idx ? null : idx;
      renderGame();
    });
    e.appendChild(b);
  });
}
let pendingJokerPlacement = null;

function boardClick(idx) {
  const cell = state.board[idx];

  if (selectedRackIndex === null && (cell.isNew || cell.isReplacement)) {
    returnSingleTile(idx);
    return;
  }
  if (selectedRackIndex === null) {
    message("Buchstabe wählen", "Bitte zuerst einen Buchstaben aus der Leiste antippen. Neu gelegte Buchstaben kannst du durch Antippen wieder zurücklegen.");
    return;
  }

  const chosen = state.rack[selectedRackIndex];
  if (!chosen) return;

  if (isJokerTile(chosen)) {
    askJokerLetter(idx, selectedRackIndex);
    return;
  }
  placeTileOnBoard(idx, selectedRackIndex, chosen, false);
}

function placeTileOnBoard(idx, rackIndex, chosen, isJoker=false) {
  const cell = state.board[idx];
  if (!cell.letter) {
    cell.letter = chosen;
    cell.joker = isJoker;
    cell.settled = false;
    cell.isNew = true;
    cell.isReplacement = false;
    cell.previousLetter = "";
    cell.previousJoker = false;
  } else {
    if (!state.firstSuccessfulMove) { message("Noch nicht möglich", "Buchstaben dürfen erst ab Runde 2 überlegt werden."); return; }
    if (cell.isNew || cell.isReplacement) { message("Schon geändert", "Tippe den gelegten Buchstaben ohne ausgewählten Handstein an, um ihn zurückzulegen."); return; }
    if (cell.letter === chosen) { message("Nicht erlaubt", "Ein Buchstabe darf nicht durch denselben Buchstaben ersetzt werden."); return; }
    cell.previousLetter = cell.letter;
    cell.previousJoker = !!cell.joker;
    cell.letter = chosen;
    cell.joker = isJoker;
    cell.isReplacement = true;
    cell.isNew = false;
  }
  state.rack[rackIndex] = "";
  selectedRackIndex = null;
  renderGame();
}

function askJokerLetter(boardIndex, rackIndex) {
  pendingJokerPlacement = {boardIndex, rackIndex};
  const input = $("jokerInput");
  input.value = "";
  renderJokerChoices();
  $("jokerDialog").showModal();
}

function renderJokerChoices() {
  const wrap = $("jokerChoices");
  if (!wrap) return;
  wrap.innerHTML = JOKER_CHOICES.map(ch => `<button type="button" data-joker="${escapeHtml(ch)}">${escapeHtml(ch)}</button>`).join("");
  wrap.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    $("jokerInput").value = btn.dataset.joker;
    confirmJokerLetter();
  }));
}

function normalizeJokerChoice(value) {
  let v = String(value || "").trim().toUpperCase();
  if (v === "Q") v = "QU";
  if (v === "SS") v = "ß";
  if (JOKER_CHOICES.includes(v)) return v;
  return "";
}

function confirmJokerLetter() {
  const chosen = normalizeJokerChoice($("jokerInput").value);
  if (!chosen) { message("Joker wählen", "Bitte wähle einen gültigen Buchstaben, zum Beispiel A, M, Ä oder QU."); return; }
  const pending = pendingJokerPlacement;
  pendingJokerPlacement = null;
  $("jokerDialog").close();
  if (!pending) return;
  placeTileOnBoard(pending.boardIndex, pending.rackIndex, chosen, true);
}

function cancelJokerLetter() {
  pendingJokerPlacement = null;
  $("jokerDialog").close();
}

function returnSingleTile(idx) {
  const cell = state.board[idx];
  const empty = state.rack.indexOf("");
  if (empty < 0) { message("Ablage voll", "Es ist gerade kein freier Platz in der Buchstabenleiste vorhanden."); return; }
  const returned = cell.joker ? JOKER_TILE : cell.letter;
  state.rack[empty] = returned;
  if (cell.isReplacement) {
    cell.letter = cell.previousLetter;
    cell.joker = !!cell.previousJoker;
    cell.previousLetter = "";
    cell.previousJoker = false;
    cell.isReplacement = false;
  } else {
    cell.letter = "";
    cell.joker = false;
    cell.settled = false;
    cell.isNew = false;
  }
  renderGame();
}

function renderPreview() {
  const p = analyzeMove();
  const el = $("preview");
  const placed = p.changedCells.map(formatCellLetter);
  const words = p.words.map(w => w.word);
  let h = "";
  h += `<strong>Gelegte Buchstaben:</strong>`;
  h += placed.length ? `<ul>${placed.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : `<p class="muted">Noch keine.</p>`;
  h += `<strong>Erkannte Wörter:</strong>`;
  h += words.length ? `<ul>${words.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : `<p class="muted">Noch keine.</p>`;
  h += `<strong>Voraussichtliche Punkte:</strong>`;
  h += renderScoreDetails(p.scoreDetails, p.points);
  if (p.errors.length) h += `<strong>Fehlerhinweise:</strong><ul>${p.errors.map(e => `<li class="bad">${escapeHtml(e)}</li>`).join("")}</ul>`;
  else if (p.changedCells.length) h += `<p class="ok">Der Zug sieht gültig aus.</p>`;
  else h += `<p class="warn">Lege Buchstaben oder wähle „Passe“.</p>`;
  el.innerHTML = h;
}

function renderScoreDetails(d, points) {
  if (!d) d = {basePoints:0, longestWord:"", lengthBonus:0, comboBonus:0, replacementBonus:0, handBonus:0};
  const longest = d.longestWord ? ` (${escapeHtml(d.longestWord)})` : "";
  return `
    <div class="scoreDetails">
      <div><span>Wortpunkte</span><strong>${d.basePoints}</strong></div>${d.specialText ? `<div><span>Sonderfelder</span><strong>${escapeHtml(d.specialText)}</strong></div>` : ""}
      <div><span>Längenbonus${longest}</span><strong>+${d.lengthBonus}</strong></div>
      <div><span>Kombobonus</span><strong>+${d.comboBonus}</strong></div>
      <div><span>Überlegebonus</span><strong>+${d.replacementBonus}</strong></div>
      <div><span>Handbonus</span><strong>+${d.handBonus}</strong></div>
      <div class="scoreTotal"><span>Gesamt</span><strong>${points || 0}</strong></div>
    </div>`;
}

function renderLastMove() {
  const e = $("lastMove");
  if (!state.lastMove) {
    e.className = "lastMove muted";
    e.textContent = "Noch kein Zug gewertet.";
    return;
  }
  e.className = "lastMove";
  const d = state.lastMove.scoreDetails;
  const details = d ? `<small>Buchstaben ${d.basePoints}, Länge +${d.lengthBonus}, Kombo +${d.comboBonus}, Überlegen +${d.replacementBonus}, Hand +${d.handBonus}</small><br>` : "";
  e.innerHTML = `<strong>Wörter:</strong> ${state.lastMove.words.map(escapeHtml).join(", ")}<br><strong>Verwendet:</strong> ${state.lastMove.usedLetters.map(escapeHtml).join(", ")}<br><strong>Punkte:</strong> +${state.lastMove.points}<br>${details}<strong>Gesamt:</strong> ${state.score}`;
}
function analyzeMove() {
  const changedCells = state.board.map((c,index) => ({...c,index})).filter(c => c.isNew || c.isReplacement), errors = [];
  if (!changedCells.length) return {changedCells, words: [], errors: ["Noch kein Buchstabe gelegt."], points: 0, unknown: []};
  if (!areChangedCellsInOneLine(changedCells)) errors.push("Alle neuen Buchstaben müssen in einer waagerechten oder senkrechten Linie liegen.");
  if (state.mode !== "letters" && !state.firstSuccessfulMove) {
    if (!changedCells.some(c => c.index === getCenterIndex())) errors.push("Der erste Zug muss das Mittelfeld bedecken.");
    if (changedCells.length < 2) errors.push("Im ersten Zug müssen mindestens 2 Buchstaben gelegt werden.");
  }
  if (state.firstSuccessfulMove && !isConnectedToExisting(changedCells)) errors.push("Der Zug muss mit einem bereits liegenden Buchstaben verbunden sein.");
  const words = findAffectedWords(changedCells);
  if (!words.length) errors.push("Es wurde noch kein Wort mit mindestens 2 Buchstaben erkannt.");
  const unknown = words.filter(w => !isWordKnown(w.word)).map(w => w.word);
  unknown.forEach(w => errors.push(`Wort nicht gefunden: ${w}`));
  const scoreDetails = calculateScoreDetails(words, changedCells);
  const points = scoreDetails.total;
  return {changedCells, words, errors, points, unknown, scoreDetails};
}
function areChangedCellsInOneLine(cells) {
  const size = getBoardSize();
  if (cells.length <= 1) return true;
  const rows = new Set(cells.map(c => Math.floor(c.index / size))), cols = new Set(cells.map(c => c.index % size));
  if (rows.size === 1) {
    const row = [...rows][0], sorted = cells.map(c => c.index % size).sort((a,b) => a-b);
    for (let col = sorted[0]; col <= sorted[sorted.length - 1]; col++) if (!state.board[row * size + col].letter) return false;
    return true;
  }
  if (cols.size === 1) {
    const col = [...cols][0], sorted = cells.map(c => Math.floor(c.index / size)).sort((a,b) => a-b);
    for (let row = sorted[0]; row <= sorted[sorted.length - 1]; row++) if (!state.board[row * size + col].letter) return false;
    return true;
  }
  return false;
}
function isConnectedToExisting(cells) {
  return cells.some(c => neighbors(c.index).some(n => {
    const cell = state.board[n];
    return cell && cell.letter && !cell.isNew && !cell.isReplacement;
  })) || cells.some(c => c.isReplacement);
}
function findAffectedWords(cells) {
  const result = new Map();
  for (const c of cells) {
    const h = scanWord(c.index, 0, 1), v = scanWord(c.index, 1, 0);
    // QU ist ein einzelner Spielstein, zählt aber als zwei Buchstaben.
    // Für Kreuzwörter zählt hier die Anzahl der belegten Felder, nicht die Zeichenlänge.
    if (h.indexes.length >= 2) result.set(h.key, h);
    if (v.indexes.length >= 2) result.set(v.key, v);
  }
  return [...result.values()];
}
function scanWord(index, dr, dc) {
  const size = getBoardSize();
  let r = Math.floor(index / size), c = index % size;
  while (true) {
    const pr = r - dr, pc = c - dc;
    if (pr < 0 || pr >= size || pc < 0 || pc >= size) break;
    if (!state.board[pr * size + pc].letter) break;
    r = pr; c = pc;
  }
  const start = r * size + c;
  let word = "";
  const indexes = [];
  while (r >= 0 && r < size && c >= 0 && c < size && state.board[r * size + c].letter) {
    word += state.board[r * size + c].letter;
    indexes.push(r * size + c);
    r += dr; c += dc;
  }
  return {word, indexes, key: `${start}:${dr}:${dc}`};
}

function calculateScoreDetails(words, changedCells) {
  const changedSet = new Set(changedCells.map(c => c.index));
  const wordDetails = words.map(w => {
    let letterPoints = 0;
    let wordMultiplier = 1;
    const specialBonuses = [];
    const letters = w.indexes.map(idx => state.board[idx].letter);
    for (const idx of w.indexes) {
      const cell = state.board[idx];
      let points = getCellTilePoints(cell);
      const triggered = changedSet.has(idx) && cell.bonus && !cell.bonusUsed;
      if (triggered) {
        if (cell.bonus === "DL") { points *= 2; specialBonuses.push(`${cell.letter} auf 2B`); }
        if (cell.bonus === "TL") { points *= 3; specialBonuses.push(`${cell.letter} auf 3B`); }
        if (cell.bonus === "DW") { wordMultiplier *= 2; specialBonuses.push(`${w.word} auf 2W`); }
        if (cell.bonus === "TW") { wordMultiplier *= 3; specialBonuses.push(`${w.word} auf 3W`); }
      }
      letterPoints += points;
    }
    return {
      word: w.word,
      length: w.indexes.length,
      letterPoints,
      wordMultiplier,
      totalPoints: letterPoints * wordMultiplier,
      specialBonuses
    };
  });

  const basePoints = wordDetails.reduce((sum, w) => sum + w.totalPoints, 0);
  const longestWord = wordDetails.slice().sort((a, b) => b.length - a.length)[0] || null;
  const lengthBonus = longestWord ? getWordLengthBonus(longestWord.length) : 0;
  const comboBonus = getComboBonus(wordDetails.length);
  const replacementCount = changedCells.filter(c => c.isReplacement).length;
  const replacementBonus = replacementCount * 2;
  const handBonus = changedCells.length === 7 ? 20 : 0;
  const total = basePoints + lengthBonus + comboBonus + replacementBonus + handBonus;
  const specialText = wordDetails.flatMap(w => w.specialBonuses).join(", ");

  return {
    wordDetails,
    basePoints,
    longestWord: longestWord ? longestWord.word : "",
    lengthBonus,
    comboBonus,
    replacementCount,
    replacementBonus,
    handBonus,
    specialText,
    total
  };
}

function calculatePoints(words, changedCells) {
  return calculateScoreDetails(words, changedCells).total;
}

function formatMoveScoreBreakdown(d, total) {
  if (!d) return `Du erhältst ${total || 0} Punkte.`;
  const lines = [
    `Gesamt: ${total || 0} Punkte`,
    `Wortpunkte: ${d.basePoints || 0}`,
    `Längenbonus: +${d.lengthBonus || 0}`,
    `Kombobonus: +${d.comboBonus || 0}`,
    `Wandelbonus: +${d.replacementBonus || 0}`,
    `Handbonus: +${d.handBonus || 0}`
  ];
  if (d.specialText) lines.splice(2, 0, `Sonderfelder: ${d.specialText}`);
  return `Du erhältst ${total || 0} Punkte.\n\nAufschlüsselung:\n${lines.join("\n")}`;
}

function formatMoveConfirmationText(p) {
  return `Zug für ${p.points || 0} Pkt. spielen?`;
}

function confirmAndFinalizeMove(p) {
  confirmDialog("", formatMoveConfirmationText(p), "Ja, spielen", () => finalizeMove(p), "Noch ändern");
}

function commitMove() {
  const p = analyzeMove();
  const realErrors = p.errors.filter(e => !e.startsWith("Wort nicht gefunden"));
  if (realErrors.length) { message("Zug noch nicht gültig", realErrors.join("\n")); return; }
  if (p.unknown.length) { pendingUnknownWords = [...p.unknown]; askNextUnknown(); return; }
  confirmAndFinalizeMove(p);
}
function askNextUnknown() {
  if (!pendingUnknownWords.length) {
    const p = analyzeMove();
    const real = p.errors.filter(e => !e.startsWith("Wort nicht gefunden"));
    if (real.length) message("Zug noch nicht gültig", real.join("\n"));
    else confirmAndFinalizeMove(p);
    return;
  }
  $("verifyWord").textContent = pendingUnknownWords[0];
  $("verifyDialog").showModal();
}
function acceptUnknownWord() {
  const w = pendingUnknownWords.shift(), lex = getPersonalLexicon();
  lex.add(normalizeWord(w));
  savePersonalLexicon(lex);
  renderLexicon();
  $("verifyDialog").close();
  askNextUnknown();
}
function rejectUnknownWord() {
  $("verifyDialog").close();
  pendingUnknownWords = [];
  undoTurn(true);
  message("Zug abgebrochen", "Das Wort wurde nicht übernommen. Die gelegten Buchstaben wurden zurückgegeben.");
}

function getMovePraiseTitle(points) {
  if (points >= 50) return "Fantastischer Zug!";
  if (points >= 30) return "Starker Zug!";
  if (points >= 15) return "Gut gelegt!";
  return "Schöner Zug!";
}

function formatMoveSuccessText(p) {
  const words = (p.words || []).map(w => w.word).join(", ");
  const main = p.words?.length === 1
    ? `${words} bringt ${p.points || 0} Pkt.`
    : `${p.words?.length || 0} Wörter bringen ${p.points || 0} Pkt.`;
  const details = formatMoveScoreBreakdown(p.scoreDetails, p.points)
    .replace(/Punkte/g, "Pkt.")
    .replace(/^Du erhältst .*?\n\n/, "");
  return `${main}\nGesamt: ${state.score} Pkt.\n\n${details}`;
}
function finalizeMove(p) {
  state.score += p.points;
  state.lastMove = {
    words: p.words.map(w => w.word),
    usedLetters: p.changedCells.map(formatCellLetter),
    points: p.points,
    scoreDetails: p.scoreDetails,
    date: new Date().toISOString()
  };
  updateGameStats(p);
  for (const cell of state.board) {
    if (cell.isNew || cell.isReplacement) cell.settled = true;
    if ((cell.isNew || cell.isReplacement) && cell.bonus && !cell.bonusUsed) cell.bonusUsed = true;
    cell.isNew = false;
    cell.isReplacement = false;
    cell.previousLetter = "";
    cell.previousJoker = false;
  }
  state.firstSuccessfulMove = true;
  state.round += 1;
  state.rack = drawRack(state.rack, false);
  selectedRackIndex = null;
  renderGame();
  saveAutosave();
  if (!checkGameEndAfterTurn()) message(getMovePraiseTitle(p.points), formatMoveSuccessText(p));
}



function createEmptyStats() {
  return {
    totalWords: 0,
    longestWord: "",
    longestWordLength: 0,
    bestMoveWord: "",
    bestMovePoints: 0,
    bestSingleWord: "",
    bestSingleWordPoints: 0
  };
}

function ensureStats() {
  if (!state.stats) state.stats = createEmptyStats();
  return state.stats;
}

function displayWordLength(word) {
  return String(word || "").length;
}

function updateGameStats(p) {
  if (!state || !p) return;
  const stats = ensureStats();
  const details = p.scoreDetails?.wordDetails || [];
  stats.totalWords += details.length;

  for (const wordInfo of details) {
    const len = displayWordLength(wordInfo.word);
    if (len > (stats.longestWordLength || 0)) {
      stats.longestWord = wordInfo.word;
      stats.longestWordLength = len;
    }
    if ((wordInfo.totalPoints || 0) > (stats.bestSingleWordPoints || 0)) {
      stats.bestSingleWord = wordInfo.word;
      stats.bestSingleWordPoints = wordInfo.totalPoints || 0;
    }
  }

  const primary = details.slice().sort((a,b) => (b.totalPoints || 0) - (a.totalPoints || 0) || displayWordLength(b.word) - displayWordLength(a.word))[0];
  if ((p.points || 0) > (stats.bestMovePoints || 0)) {
    stats.bestMovePoints = p.points || 0;
    stats.bestMoveWord = primary?.word || (p.words?.[0]?.word || "");
  }
}

function getCompletedRounds() {
  if (!state) return 0;
  return Math.max(0, (Number(state.round) || 1) - 1);
}

function formatDecimal(value) {
  return Number(value || 0).toFixed(1).replace(".", ",");
}

function getGameAveragePerRound(score, rounds) {
  return rounds > 0 ? score / rounds : 0;
}

function buildFinalSummary(reason) {
  const score = state?.score || 0;
  const rounds = getCompletedRounds();
  const stats = state?.stats || createEmptyStats();
  const average = getGameAveragePerRound(score, rounds);
  const longest = stats.longestWord ? `${stats.longestWord} · ${stats.longestWordLength} Buchstaben` : "–";
  const bestMove = stats.bestMoveWord ? `${stats.bestMoveWord} · ${stats.bestMovePoints || 0} Pkt.` : "–";
  const bestSingle = stats.bestSingleWord ? `${stats.bestSingleWord} · ${stats.bestSingleWordPoints || 0} Pkt.` : "–";
  const totalWords = stats.totalWords || 0;
  const text = [
    reason,
    "",
    `Gesamt: ${score} Pkt.`,
    `Runden: ${rounds}`,
    `Ø pro Runde: ${formatDecimal(average)} Pkt.`,
    `Gewertete Wörter: ${totalWords}`,
    "",
    `Längstes Wort:\n${longest}`,
    "",
    `Stärkster Zug:\n${bestMove}`,
    "",
    `Bestes Einzelwort:\n${bestSingle}`
  ].join("\n");
  return {
    score, rounds, averagePerRound: Number(average.toFixed(1)), totalWords,
    longestWord: stats.longestWord || "",
    longestWordLength: stats.longestWordLength || 0,
    bestMoveWord: stats.bestMoveWord || "",
    bestMovePoints: stats.bestMovePoints || 0,
    bestSingleWord: stats.bestSingleWord || "",
    bestSingleWordPoints: stats.bestSingleWordPoints || 0,
    text
  };
}

function getRackPenalty() {
  if (!state?.rack) return 0;
  return state.rack.filter(Boolean).reduce((sum, tile) => sum + getTilePoints(tile), 0);
}

function isGiveUpAvailable() {
  if (!state || state.endMode !== "classic") return false;
  const bag = state.bag?.length || 0;
  const hand = state.rack.filter(Boolean).length;
  return bag === 0 && hand > 0;
}

function giveUpGame() {
  if (!state) return;
  const penalty = getRackPenalty();
  const hand = state.rack.filter(Boolean).join(", ") || "keine";
  confirmDialog("Aufgeben", `Möchtest du das Spiel jetzt aufgeben?\n\nHandsteine: ${hand}\nHandwert: ${penalty} Punkte\n\nDieser Wert wird von deinem Gesamtstand abgezogen.`, "Ja, aufgeben", () => {
    state.score -= penalty;
    state.lastMove = {words: ["Aufgegeben"], usedLetters: state.rack.filter(Boolean), points: -penalty, date: new Date().toISOString()};
    finishGame(`Du hast aufgegeben. Der Handwert wurde abgezogen: -${penalty} Punkte.`);
  });
}

function checkGameEndAfterTurn() {
  if (!state) return false;
  if (state.endMode === "rounds" && state.round > state.roundLimit) {
    finishGame(`Die eingestellte Rundenzahl (${state.roundLimit}) ist erreicht.`);
    return true;
  }
  if (state.endMode === "classic") {
    const hand = state.rack.filter(Boolean).length;
    const bag = state.bag?.length || 0;
    if (bag === 0 && hand === 0) {
      finishGame("Der Buchstabenbeutel ist leer und du hast keine Handsteine mehr.");
      return true;
    }
    if (bag === 0) {
      message("Buchstabenbeutel leer", "Du kannst noch mit den vorhandenen Handsteinen weiterspielen. Wenn du nichts mehr legen kannst, nutze „Aufgeben“. Dann wird der Handwert abgezogen.");
    }
  }
  return false;
}
function finishGame(reason) {
  const summary = buildFinalSummary(reason);
  try { addLeaderboardEntry(summary); } catch (err) { console.error("Bestenliste konnte nicht aktualisiert werden", err); }
  clearAutosave();
  state = null;
  selectedRackIndex = null;
  showScreen("screen-menu");
  setTimeout(() => message("Spiel beendet – gut gebrabbelt!", summary.text), 0);
}

function randomPraise() { return PRAISES[Math.floor(Math.random() * PRAISES.length)]; }
function undoTurn(silent=false) {
  if (!state) return;
  const changed = state.board.map((c,index) => ({...c,index})).filter(c => c.isNew || c.isReplacement);
  if (!changed.length) {
    if (!silent) message("Nichts zurückzunehmen", "In dieser Runde wurde noch kein Buchstabe gelegt. Wähle einen Buchstaben aus der Leiste oder tippe auf „Passe“.");
    return;
  }
  for (let i = changed.length - 1; i >= 0; i--) {
    const c = changed[i], empty = state.rack.indexOf("");
    if (empty >= 0) state.rack[empty] = c.letter;
    const cell = state.board[c.index];
    if (cell.isReplacement) { cell.letter = cell.previousLetter; cell.previousLetter = ""; cell.isReplacement = false; }
    else { cell.letter = ""; cell.isNew = false; }
  }
  selectedRackIndex = null;
  renderGame();
}
function passTurn() {
  const changed = state.board.some(c => c.isNew || c.isReplacement);
  const doPass = () => {
    undoTurn(true);
    if (isClassicGame()) { state.bag = shuffleArray((state.bag || []).concat(state.rack.filter(Boolean))); state.rack = drawRack([], true); }
    else state.rack = drawRack([], true);
    state.round += 1;
    state.lastMove = {words: ["Passe"], usedLetters: [], points: 0, date: new Date().toISOString()};
    selectedRackIndex = null;
    renderGame();
    saveAutosave();
    if (!checkGameEndAfterTurn()) message("Runde ausgesetzt", isClassicGame() ? "Du hast gepasst und neue Buchstaben aus dem Beutel gezogen." : "Du hast gepasst und 7 neue Buchstaben erhalten.");
  };
  const text = changed
    ? "Du hast in dieser Runde bereits Buchstaben gelegt. Wenn du passt, werden sie zurückgenommen und du erhältst 7 neue Buchstaben. Wirklich passen?"
    : "Möchtest du die Runde wirklich aussetzen und 7 neue Buchstaben erhalten?";
  confirmDialog("Passe bestätigen", text, "Ja, passen", doPass);
}
function endGame() {
  if (!state) { showScreen("screen-menu"); return; }
  confirmDialog("Zum Hauptmenü", "Das Spiel ohne Speichern beenden?", "Ja, beenden", () => {
    // Nur ins Hauptmenü wechseln: kein Bestenlisten-Eintrag, kein Entfernen des Autosaves.
    showScreen("screen-menu");
  }, "Nein, zurück");
}
function addLeaderboardEntry(summary=null) {
  if (!state || Number(state.score) <= 0) return;
  const finalSummary = summary || buildFinalSummary("Spiel beendet.");
  const list = getLeaderboard();
  list.push({
    player: localStorage.getItem(K.player) || "Spieler",
    score: finalSummary.score,
    rounds: finalSummary.rounds,
    averagePerRound: finalSummary.averagePerRound,
    totalWords: finalSummary.totalWords,
    longestWord: finalSummary.longestWord,
    longestWordLength: finalSummary.longestWordLength,
    bestMoveWord: finalSummary.bestMoveWord,
    bestMovePoints: finalSummary.bestMovePoints,
    bestSingleWord: finalSummary.bestSingleWord,
    bestSingleWordPoints: finalSummary.bestSingleWordPoints,
    date: new Date().toISOString(),
    mode: `${describeBoardMode(state.mode)} · ${getBoardSize()}×${getBoardSize()} · ${state.endMode === "classic" ? "Klassisch" : state.endMode === "rounds" ? "Runden" : "Endlos"}`
  });
  list.sort((a,b) => b.score - a.score);
  localStorage.setItem(K.leaderboard, JSON.stringify(list.slice(0, 10)));
}
function getLeaderboard() { try { return JSON.parse(localStorage.getItem(K.leaderboard) || "[]"); } catch { return []; } }
function renderLeaderboard() {
  const list = getLeaderboard(), e = $("leaderboardList");
  if (!list.length) { e.innerHTML = `<p class="muted">Noch keine Einträge.</p>`; return; }
  e.innerHTML = list.map((x,i) => {
    const rounds = x.rounds || "?";
    const average = typeof x.averagePerRound === "number" ? ` · Ø ${formatDecimal(x.averagePerRound)}` : "";
    const longest = x.longestWord ? `Längstes Wort: ${escapeHtml(x.longestWord)}` : "Längstes Wort: –";
    const bestMove = x.bestMovePoints ? `stärkster Zug: ${escapeHtml(x.bestMoveWord || "–")} · ${x.bestMovePoints} Pkt.` : "stärkster Zug: –";
    return `<div class="leaderRow"><strong>${i+1}. ${escapeHtml(x.player)}</strong><span>${x.score} Punkte · ${rounds} Runden${average} · ${escapeHtml(x.mode)} · ${formatDateTime(x.date)}</span><small>${longest} · ${bestMove}</small></div>`;
  }).join("");
}
function getAutosave() {
  try { return JSON.parse(localStorage.getItem(K.autosave) || "null"); }
  catch { return null; }
}
function saveAutosave() {
  if (!state) return;
  const copy = JSON.parse(JSON.stringify(state));
  copy.savedAt = new Date().toISOString();
  copy.autosave = true;
  localStorage.setItem(K.autosave, JSON.stringify(copy));
}
function clearAutosave() {
  localStorage.removeItem(K.autosave);
}
function renderAutosaveCard() {
  const auto = getAutosave();
  if (!auto) return `<div class="slot autosaveSlot"><strong>Autosave</strong><span class="muted">Kein Autosave vorhanden.</span></div>`;
  return `<div class="slot autosaveSlot"><strong>Autosave</strong><span>${escapeHtml(auto.player || "Spieler")} · ${auto.score || 0} Punkte · Runde ${auto.round || 1} · ${auto.boardSize || 9}×${auto.boardSize || 9} · ${formatDateTime(auto.savedAt)}</span><div class="slotActions"><button onclick="loadAutosave()" class="primary">Laden</button><button onclick="deleteAutosave()" class="danger">Löschen</button></div></div>`;
}

function getSlots() { try { const s = JSON.parse(localStorage.getItem(K.slots) || "null"); return Array.isArray(s) ? s : [null,null,null]; } catch { return [null,null,null]; } }
function saveSlots(s) { localStorage.setItem(K.slots, JSON.stringify(s)); }
function renderSlots() {
  const slots = getSlots();
  $("slotList").innerHTML = renderAutosaveCard() + slots.map((slot,i) => `<div class="slot"><strong>Spielstand ${i+1}</strong>${slot ? `<span>${escapeHtml(slot.player)} · ${slot.score} Punkte · Runde ${slot.round} · ${slot.boardSize || 9}×${slot.boardSize || 9} · ${formatDate(slot.savedAt)}</span><div class="slotActions"><button onclick="loadSlot(${i})" class="primary">Laden</button><button onclick="deleteSlot(${i})" class="danger">Löschen</button></div>` : `<span class="muted">Leer</span>`}</div>`).join("");
}
function renderSaveSlots() {
  const slots = getSlots();
  $("saveSlotList").innerHTML = slots.map((slot,i) => `<div class="slot"><strong>Spielstand ${i+1}</strong>${slot ? `<span>${escapeHtml(slot.player)} · ${slot.score} Punkte · Runde ${slot.round} · ${slot.boardSize || 9}×${slot.boardSize || 9} · ${formatDate(slot.savedAt)}</span><div class="slotActions"><button onclick="saveToSlot(${i})" class="primary">Hier speichern</button><button onclick="deleteSlot(${i})" class="danger">Löschen</button></div>` : `<span class="muted">Leer</span><button onclick="saveToSlot(${i})" class="primary">Hier speichern</button>`}</div>`).join("");
}
window.saveToSlot = function(i) {
  const slots = getSlots();
  state.savedAt = new Date().toISOString();
  slots[i] = JSON.parse(JSON.stringify(state));
  saveSlots(slots);
  message("Gespeichert", `Spielstand ${i+1} wurde gespeichert.`);
  showScreen("screen-game");
};
window.loadAutosave = function() {
  const auto = getAutosave();
  if (!auto) { message("Autosave", "Es ist kein Autosave vorhanden."); return; }
  state = auto;
  delete state.autosave;
  selectedRackIndex = null;
  showScreen("screen-game");
  renderGame();
};
window.deleteAutosave = function() {
  if (!getAutosave()) return;
  confirmDialog("Autosave löschen", "Soll der Autosave wirklich gelöscht werden?", "Ja, löschen", () => {
    clearAutosave();
    renderSlots();
    message("Gelöscht", "Der Autosave wurde gelöscht.");
  });
};

window.loadSlot = function(i) {
  const slot = getSlots()[i];
  if (!slot) return;
  state = slot; selectedRackIndex = null;
  showScreen("screen-game"); renderGame();
};
window.deleteSlot = function(i) {
  const slots = getSlots();
  if (!slots[i]) return;
  confirmDialog("Spielstand löschen", `Soll Spielstand ${i+1} wirklich gelöscht werden?`, "Ja, löschen", () => {
    slots[i] = null;
    saveSlots(slots);
    renderSlots();
    renderSaveSlots();
    message("Gelöscht", `Spielstand ${i+1} wurde gelöscht.`);
  });
};
function neighbors(index) {
  const size = getBoardSize();
  const r = Math.floor(index / size), c = index % size, out = [];
  if (r > 0) out.push(index - size);
  if (r < size - 1) out.push(index + size);
  if (c > 0) out.push(index - 1);
  if (c < size - 1) out.push(index + 1);
  return out;
}
function clamp(v,min,max) { return Math.max(min, Math.min(max, v)); }
function formatDate(iso) { return iso ? new Date(iso).toLocaleDateString("de-DE", {year:"numeric",month:"2-digit",day:"2-digit"}) : "ohne Datum"; }
function formatDateTime(iso) { return iso ? new Date(iso).toLocaleString("de-DE", {year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}) : "ohne Datum"; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch])); }


function getMainDictionaryCount() {
  if (typeof DICTIONARY_INFO !== "undefined" && DICTIONARY_INFO.entries) return DICTIONARY_INFO.entries;
  if (typeof BASE_WORDS !== "undefined" && BASE_WORDS.size) return BASE_WORDS.size;
  if (typeof BASE_WORDS_RAW !== "undefined" && BASE_WORDS_RAW.length) return BASE_WORDS_RAW.length;
  return "–";
}

function renderLexicon() {
  const listEl = $("lexiconList");
  if (!listEl) return;

  const lex = [...getPersonalLexicon()].sort();
  const search = normalizeWord(($("lexiconSearchInput") && $("lexiconSearchInput").value) || "");
  const filtered = search ? lex.filter(w => w.includes(search)) : lex;

  $("mainDictCount").textContent = getMainDictionaryCount().toLocaleString ? getMainDictionaryCount().toLocaleString("de-DE") : getMainDictionaryCount();
  $("personalDictCount").textContent = lex.length.toLocaleString("de-DE");

  if (!lex.length) {
    listEl.innerHTML = `<p class="muted">Noch keine eigenen Wörter gespeichert.</p>`;
    return;
  }

  if (!filtered.length) {
    listEl.innerHTML = `<p class="muted">Keine passenden Wörter gefunden.</p>`;
    return;
  }

  listEl.innerHTML = filtered.map(w => `
    <div class="lexiconItem">
      <strong>${escapeHtml(w)}</strong>
      <button onclick="deleteLexiconWord('${escapeHtml(w)}')" class="danger">Löschen</button>
    </div>
  `).join("");
}

function addLexiconWord() {
  const input = $("lexiconInput");
  const raw = input.value.trim();
  const normalized = normalizeWord(raw);

  if (!normalized || normalized.length < 2) {
    message("Wortschatz", "Bitte gib ein Wort mit mindestens 2 Buchstaben ein.");
    return;
  }

  const lex = getPersonalLexicon();
  const existed = lex.has(normalized);
  lex.add(normalized);
  savePersonalLexicon(lex);
  input.value = "";
  renderLexicon();

  message("Wortschatz", existed
    ? `„${raw}“ war bereits im persönlichen Wortschatz.`
    : `„${raw}“ wurde gespeichert.`);
}

window.deleteLexiconWord = function(word) {
  const normalized = normalizeWord(word);
  const lex = getPersonalLexicon();
  lex.delete(normalized);
  savePersonalLexicon(lex);
  renderLexicon();
};

function exportLexicon() {
  const data = {
    app: "Brabbel",
    type: "personal_lexicon",
    version: "4.1",
    exportedAt: new Date().toISOString(),
    words: [...getPersonalLexicon()].sort()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `brabbel_wortschatz_${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importLexicon(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const words = Array.isArray(parsed) ? parsed : parsed.words;
      if (!Array.isArray(words)) throw new Error("Keine Wortliste gefunden.");

      const lex = getPersonalLexicon();
      let added = 0;
      for (const word of words) {
        const n = normalizeWord(word);
        if (n && n.length >= 2 && !lex.has(n)) {
          lex.add(n);
          added++;
        }
      }
      savePersonalLexicon(lex);
      renderLexicon();
      message("Import abgeschlossen", `${added} neue Wörter wurden importiert.`);
    } catch (err) {
      message("Import fehlgeschlagen", "Die Datei konnte nicht als Brabbel-Wortschatz gelesen werden.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}


function twoFingerCommitEnabled() {
  return localStorage.getItem(K.twoFingerCommit) !== "false";
}

function handleTwoFingerBoardTap(event) {
  if (!state || !twoFingerCommitEnabled()) return;
  if (!event.touches || event.touches.length !== 2) return;
  const now = Date.now();
  if (now - lastTwoFingerCommitAt < 1200) return;
  lastTwoFingerCommitAt = now;
  event.preventDefault();
  commitMove();
}

function applyInfoPanelSetting() {
  document.body.classList.toggle("infoCollapsed", infoPanelCollapsed);
  const btn = $("toggleInfoPanelBtn");
  if (btn) btn.textContent = infoPanelCollapsed ? "Infos anzeigen" : "Infos ausblenden";
}

function toggleInfoPanel() {
  infoPanelCollapsed = !infoPanelCollapsed;
  localStorage.setItem(K.infoPanelCollapsed, infoPanelCollapsed ? "true" : "false");
  applyInfoPanelSetting();
}

function animationsEnabled() {
  return localStorage.getItem(K.animations) !== "false";
}

function applyAnimationSetting() {
  document.body.classList.toggle("animations-off", !animationsEnabled());
}

function renderSettings() {
  const toggle = $("animationsToggle");
  if (toggle) toggle.checked = animationsEnabled();
  const twoFinger = $("twoFingerToggle");
  if (twoFinger) twoFinger.checked = twoFingerCommitEnabled();
}

function saveSettings() {
  const enabled = $("animationsToggle").checked;
  const twoFinger = $("twoFingerToggle") ? $("twoFingerToggle").checked : true;
  localStorage.setItem(K.animations, enabled ? "true" : "false");
  localStorage.setItem(K.twoFingerCommit, twoFinger ? "true" : "false");
  applyAnimationSetting();
  message("Gespeichert", `Animationen sind ${enabled ? "eingeschaltet" : "ausgeschaltet"}. 2-Finger-Tipp ist ${twoFinger ? "eingeschaltet" : "ausgeschaltet"}.`);
}


window.wwAcceptUnknownWord = function() {
  acceptUnknownWord();
};

window.wwRejectUnknownWord = function() {
  rejectUnknownWord();
};

window.wwConfirmNo = function() {
  confirmAction = null;
  const d = $("confirmDialog");
  if (d && d.open) d.close();
};

window.wwConfirmYes = function() {
  const action = confirmAction;
  confirmAction = null;
  const d = $("confirmDialog");
  if (d && d.open) d.close();
  if (typeof action === "function") action();
};

init();
