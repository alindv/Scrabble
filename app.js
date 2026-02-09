const BOARD_SIZE = 15;
const CENTER = 7;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTER_VALUES = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const LETTER_DISTRIBUTION = [
  ["A", 9], ["B", 2], ["C", 2], ["D", 4], ["E", 12], ["F", 2],
  ["G", 3], ["H", 2], ["I", 9], ["J", 1], ["K", 1], ["L", 4],
  ["M", 2], ["N", 6], ["O", 8], ["P", 2], ["Q", 1], ["R", 6],
  ["S", 4], ["T", 6], ["U", 4], ["V", 2], ["W", 2], ["X", 1],
  ["Y", 2], ["Z", 1], ["?", 2]
];

const SMALL_WORD_LIST = [
  "ABOUT", "ABOVE", "ACT", "ACTIVE", "ADAPT", "AGENT", "ALPHA", "APPLE", "AREA", "AWARE",
  "BASIC", "BATTLE", "BEAM", "BELOW", "BOARD", "BRAIN", "BRIGHT", "BUILD", "CABLE", "CAMERA",
  "CARRY", "CENTER", "CHAIN", "CHANCE", "CHANGE", "CHART", "CHECK", "CHESS", "CIRCLE", "CLOCK",
  "CLOUD", "COAST", "CODE", "COLOR", "COMMON", "CONNECT", "CORNER", "COUNT", "COURSE", "CRAFT",
  "CREATE", "CREW", "CROSS", "CROWN", "CRYSTAL", "CYCLE", "DATA", "DAWN", "DELTA", "DEPTH",
  "DESIGN", "DIRECT", "DRAW", "DRIFT", "EARTH", "ECHO", "EDGE", "ELITE", "EMBER", "ENJOY",
  "ENTER", "EQUAL", "ERROR", "EXACT", "EXTRA", "FAIR", "FAITH", "FAVOR", "FIELD", "FINAL",
  "FLARE", "FLIGHT", "FLOAT", "FOCUS", "FORCE", "FRAME", "FRESH", "FRONT", "FRUIT", "FUTURE",
  "GAMER", "GHOST", "GLASS", "GLOBE", "GOAL", "GRACE", "GRAND", "GRASS", "GREEN", "GROUP",
  "GUIDE", "HAPPY", "HARD", "HEART", "HEAT", "HERO", "HIGH", "HONEY", "HUMAN", "IDEA",
  "IMAGE", "INDEX", "INPUT", "IRON", "JOIN", "JUDGE", "JUMP", "KIND", "KING", "KITE",
  "KNOW", "LABEL", "LARGE", "LASER", "LAYER", "LEVEL", "LIGHT", "LIMIT", "LOCAL", "LOGIC",
  "LOOP", "LUCK", "LUNAR", "MAJOR", "MARCH", "MATCH", "MATRIX", "MEDIA", "METAL", "MODEL",
  "MOON", "MOTION", "MUSIC", "NATIVE", "NIGHT", "NORTH", "NOVA", "NOVEL", "OCEAN", "OPEN",
  "ORBIT", "ORDER", "ORIGIN", "OTHER", "OUT", "PAINT", "PANEL", "PAPER", "PART", "PEACE",
  "PHASE", "PILOT", "PIXEL", "PLAIN", "PLANE", "PLANET", "PLANT", "PLAYER", "POINT", "POWER",
  "PRESS", "PRIME", "PRINT", "PRIZE", "PROUD", "QUEST", "QUICK", "QUIET", "RADAR", "RAIL",
  "RAIN", "RANGE", "RAPID", "RARE", "RAY", "REACH", "REACT", "READY", "REAL", "RELIC",
  "REMOTE", "RHYME", "RIVER", "ROUTE", "RULE", "RUSH", "SCALE", "SCENE", "SCORE", "SEARCH",
  "SELECT", "SHADOW", "SHAPE", "SHIFT", "SHINE", "SHIP", "SHOCK", "SHORT", "SKILL", "SMART",
  "SMILE", "SMOKE", "SNOW", "SOLAR", "SOLID", "SOUND", "SPACE", "SPARK", "SPEED", "SPORT",
  "STACK", "STONE", "STORM", "STORY", "STREAM", "STRIKE", "STYLE", "SUGAR", "SUPER", "TABLE",
  "TEACH", "TEAM", "TECH", "TERRA", "THINK", "THRONE", "TITLE", "TOKEN", "TRACK", "TRAIL",
  "TRAIN", "TREND", "TRICK", "TRUST", "TRUTH", "ULTRA", "UNDER", "UNITY", "URBAN", "VALUE",
  "VECTOR", "VIDEO", "VITAL", "VOICE", "VOTE", "WATER", "WAVE", "WHEEL", "WIDE", "WIND",
  "WING", "WISH", "WORLD", "WORTH", "WRITE", "YOUNG", "ZEBRA", "ZONE"
];

const SPECIAL_CELLS = (() => {
  const set = (coords) => new Set(coords.map(([r, c]) => `${r},${c}`));
  const tw = set([
    [0, 0], [0, 7], [0, 14],
    [7, 0], [7, 14],
    [14, 0], [14, 7], [14, 14]
  ]);
  const dw = set([
    [1, 1], [2, 2], [3, 3], [4, 4], [7, 7], [10, 10], [11, 11], [12, 12], [13, 13],
    [1, 13], [2, 12], [3, 11], [4, 10], [10, 4], [11, 3], [12, 2], [13, 1]
  ]);
  const tl = set([
    [1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]
  ]);
  const dl = set([
    [0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2], [6, 6], [6, 8], [6, 12],
    [7, 3], [7, 11], [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 8],
    [14, 3], [14, 11]
  ]);
  return { tw, dw, tl, dl };
})();

const boardEl = document.getElementById("board");
const boardViewport = document.getElementById("boardViewport");
const boardInner = document.getElementById("boardInner");
const rackEl = document.getElementById("rack");
const scorePlayerEl = document.getElementById("scorePlayer");
const scoreAIEl = document.getElementById("scoreAI");
const turnStatusEl = document.getElementById("turnStatus");
const playWordBtn = document.getElementById("playWord");
const shuffleRackBtn = document.getElementById("shuffleRack");
const recallBtn = document.getElementById("recall");
const newGameBtn = document.getElementById("newGame");
const difficultySelect = document.getElementById("difficulty");
const seedSelect = document.getElementById("seed");
const zoomSlider = document.getElementById("zoom");
const zoomResetBtn = document.getElementById("zoomReset");
const logEl = document.getElementById("log");

let board = [];
let bag = [];
let rack = [];
let aiRack = [];
let placedThisTurn = [];
let selectedRackIndex = null;
let scores = { player: 0, ai: 0 };
let isPlayerTurn = true;
let dictionary = new Set();
let prefixSet = new Set();
let dictionaryArray = [];

let view = { scale: 1, x: 0, y: 0, panning: false, panStart: null };

function initBoard() {
  board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function buildBag() {
  bag = [];
  LETTER_DISTRIBUTION.forEach(([letter, count]) => {
    for (let i = 0; i < count; i += 1) {
      const value = letter === "?" ? 0 : LETTER_VALUES[letter];
      bag.push({ letter, value, blank: letter === "?" });
    }
  });
  shuffleArray(bag);
}

function refillRack(targetRack) {
  while (targetRack.length < 7 && bag.length > 0) {
    targetRack.push({ ...bag.pop() });
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getCellType(row, col) {
  const key = `${row},${col}`;
  if (row === CENTER && col === CENTER) return "center";
  if (SPECIAL_CELLS.tw.has(key)) return "triple-word";
  if (SPECIAL_CELLS.dw.has(key)) return "double-word";
  if (SPECIAL_CELLS.tl.has(key)) return "triple-letter";
  if (SPECIAL_CELLS.dl.has(key)) return "double-letter";
  return "";
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("div");
      const type = getCellType(row, col);
      cell.className = `cell ${type}`.trim();
      cell.dataset.row = row;
      cell.dataset.col = col;

      const tile = board[row][col];
      if (!tile && type) {
        cell.textContent = type.replace("-", " ");
      }
      if (tile) {
        const tileEl = createTileElement(tile);
        tileEl.classList.add("locked");
        if (!tile.locked) {
          tileEl.draggable = true;
          tileEl.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", JSON.stringify({ source: "board", row, col }));
          });
        }
        cell.appendChild(tileEl);
      }

      cell.addEventListener("click", handleBoardClick);
      cell.addEventListener("dragover", handleCellDragOver);
      cell.addEventListener("dragleave", handleCellDragLeave);
      cell.addEventListener("drop", handleCellDrop);
      boardEl.appendChild(cell);
    }
  }
}

function renderRack() {
  rackEl.innerHTML = "";
  rack.forEach((tile, index) => {
    const tileEl = createTileElement(tile);
    tileEl.draggable = true;
    tileEl.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", JSON.stringify({ source: "rack", index }));
    });
    if (selectedRackIndex === index) tileEl.classList.add("selected");
    tileEl.addEventListener("click", () => handleRackClick(index));
    rackEl.appendChild(tileEl);
  });
}

function createTileElement(tile) {
  const tileEl = document.createElement("div");
  tileEl.className = "tile";
  const letter = tile.blank && tile.letter === "?" ? "" : tile.letter;
  tileEl.innerHTML = `${letter}<span class="value">${tile.value}</span>`;
  if (tile.blank) {
    tileEl.classList.add("blank");
    const dot = document.createElement("span");
    dot.className = "blank-dot";
    tileEl.appendChild(dot);
  }
  return tileEl;
}

function handleRackClick(index) {
  if (!isPlayerTurn) return;
  selectedRackIndex = selectedRackIndex === index ? null : index;
  renderRack();
}

function handleBoardClick(event) {
  if (!isPlayerTurn) return;
  if (selectedRackIndex === null) return;
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  placeTileFromRack(row, col, selectedRackIndex);
}

function handleCellDragOver(event) {
  if (!isPlayerTurn) return;
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function handleCellDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

function handleCellDrop(event) {
  if (!isPlayerTurn) return;
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);
  const data = event.dataTransfer.getData("text/plain");
  if (!data) return;
  const payload = JSON.parse(data);
  if (payload.source === "rack") {
    placeTileFromRack(row, col, payload.index);
  } else if (payload.source === "board") {
    moveBoardTile(payload.row, payload.col, row, col);
  }
}

function placeTileFromRack(row, col, rackIndex) {
  if (board[row][col]) return;
  const tile = rack.splice(rackIndex, 1)[0];
  if (!tile) return;
  if (tile.blank && tile.letter === "?") {
    const letter = prompt("Choose a letter for the blank tile (A-Z):");
    if (!letter || !/^[A-Za-z]$/.test(letter)) {
      rack.splice(rackIndex, 0, tile);
      selectedRackIndex = null;
      renderRack();
      return;
    }
    tile.letter = letter.toUpperCase();
  }
  tile.locked = false;
  board[row][col] = tile;
  placedThisTurn.push({ row, col, tile });
  selectedRackIndex = null;
  renderBoard();
  renderRack();
}

function moveBoardTile(fromRow, fromCol, toRow, toCol) {
  if (board[toRow][toCol]) return;
  const tile = board[fromRow][fromCol];
  if (!tile || tile.locked) return;
  board[fromRow][fromCol] = null;
  board[toRow][toCol] = tile;
  const placement = placedThisTurn.find((p) => p.row === fromRow && p.col === fromCol);
  if (placement) {
    placement.row = toRow;
    placement.col = toCol;
  }
  renderBoard();
}

function recallTiles() {
  placedThisTurn.forEach((placement) => {
    const { row, col, tile } = placement;
    board[row][col] = null;
    if (tile.blank) tile.letter = "?";
    rack.push(tile);
  });
  placedThisTurn = [];
  renderBoard();
  renderRack();
}

function shuffleRack() {
  if (!isPlayerTurn) return;
  shuffleArray(rack);
  renderRack();
}

function boardIsEmpty() {
  return board.flat().every((cell) => !cell || !cell.locked);
}

function getWordAt(row, col, direction) {
  let startRow = row;
  let startCol = col;
  if (direction === "row") {
    while (startCol > 0 && board[row][startCol - 1]) startCol -= 1;
  } else {
    while (startRow > 0 && board[startRow - 1][col]) startRow -= 1;
  }

  const letters = [];
  const cells = [];
  let r = startRow;
  let c = startCol;
  while (r < BOARD_SIZE && c < BOARD_SIZE && board[r][c]) {
    letters.push(board[r][c].letter);
    cells.push({ row: r, col: c, tile: board[r][c] });
    if (direction === "row") c += 1;
    else r += 1;
  }

  return { word: letters.join(""), cells };
}

function validateAndScoreMove() {
  if (placedThisTurn.length === 0) return { valid: false, reason: "Place tiles on the board." };

  const rows = placedThisTurn.map((p) => p.row);
  const cols = placedThisTurn.map((p) => p.col);
  const sameRow = rows.every((r) => r === rows[0]);
  const sameCol = cols.every((c) => c === cols[0]);

  if (placedThisTurn.length > 1 && !sameRow && !sameCol) {
    return { valid: false, reason: "Tiles must be in one row or one column." };
  }

  const empty = boardIsEmpty();
  if (empty && !placedThisTurn.some((p) => p.row === CENTER && p.col === CENTER)) {
    return { valid: false, reason: "First word must pass through the center." };
  }

  let mainDirection = sameRow ? "row" : "col";
  if (placedThisTurn.length === 1) {
    const single = placedThisTurn[0];
    const horiz = getWordAt(single.row, single.col, "row");
    const vert = getWordAt(single.row, single.col, "col");
    if (horiz.word.length === 1 && vert.word.length === 1 && !empty) {
      return { valid: false, reason: "Move must connect to existing tiles." };
    }
    if (horiz.word.length >= vert.word.length) mainDirection = "row";
    else mainDirection = "col";
  }

  const mainWord = getWordAt(rows[0], cols[0], mainDirection);
  if (mainWord.word.length < 2) return { valid: false, reason: "Word must be at least 2 letters." };

  const mainWordCells = mainWord.cells;
  if (placedThisTurn.length > 1) {
    const positions = mainWordCells.map((c) => `${c.row},${c.col}`);
    for (const placement of placedThisTurn) {
      if (!positions.includes(`${placement.row},${placement.col}`)) {
        return { valid: false, reason: "Tiles must be contiguous." };
      }
    }
  }

  if (!dictionary.has(mainWord.word)) {
    return { valid: false, reason: "Main word not in dictionary." };
  }

  let touchesLocked = empty;
  if (!empty) {
    for (const placement of placedThisTurn) {
      const adjacent = [
        [placement.row - 1, placement.col],
        [placement.row + 1, placement.col],
        [placement.row, placement.col - 1],
        [placement.row, placement.col + 1]
      ].some(([r, c]) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] && board[r][c].locked);
      if (adjacent) {
        touchesLocked = true;
        break;
      }
    }
  }
  if (!empty && !touchesLocked) {
    return { valid: false, reason: "Move must connect to existing tiles." };
  }

  const scoredWords = [];
  let totalScore = 0;

  const mainScore = scoreWord(mainWordCells, placedThisTurn);
  totalScore += mainScore;
  scoredWords.push(mainWord.word);

  for (const placement of placedThisTurn) {
    const direction = mainDirection === "row" ? "col" : "row";
    const cross = getWordAt(placement.row, placement.col, direction);
    if (cross.word.length > 1) {
      if (!dictionary.has(cross.word)) {
        return { valid: false, reason: `Cross word not in dictionary: ${cross.word}` };
      }
      if (!scoredWords.includes(cross.word)) {
        totalScore += scoreWord(cross.cells, placedThisTurn);
        scoredWords.push(cross.word);
      }
    }
  }

  if (placedThisTurn.length === 7) totalScore += 50;

  return { valid: true, word: mainWord.word, score: totalScore };
}

function scoreWord(cells, newPlacements) {
  let score = 0;
  let wordMultiplier = 1;
  for (const cell of cells) {
    let letterScore = cell.tile.value;
    const isNew = newPlacements.some((p) => p.row === cell.row && p.col === cell.col);
    if (isNew) {
      const type = getCellType(cell.row, cell.col);
      if (type === "double-letter") letterScore *= 2;
      if (type === "triple-letter") letterScore *= 3;
      if (type === "double-word") wordMultiplier *= 2;
      if (type === "triple-word") wordMultiplier *= 3;
    }
    score += letterScore;
  }
  return score * wordMultiplier;
}

function lockPlacedTiles() {
  placedThisTurn.forEach((placement) => {
    const { row, col } = placement;
    if (board[row][col]) board[row][col].locked = true;
  });
  placedThisTurn = [];
}

function logMove(actor, word, score) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = `${actor}: ${word} (+${score})`;
  logEl.prepend(entry);
}

function updateScores() {
  scorePlayerEl.textContent = scores.player;
  scoreAIEl.textContent = scores.ai;
}

function playWord() {
  if (!isPlayerTurn) return;
  const result = validateAndScoreMove();
  if (!result.valid) {
    alert(result.reason);
    return;
  }
  scores.player += result.score;
  logMove("You", result.word, result.score);
  lockPlacedTiles();
  refillRack(rack);
  updateScores();
  renderBoard();
  renderRack();
  endPlayerTurn();
}

function endPlayerTurn() {
  isPlayerTurn = false;
  turnStatusEl.textContent = "AI thinking...";
  setTimeout(() => {
    aiTurn();
    isPlayerTurn = true;
    turnStatusEl.textContent = "Your move";
    renderBoard();
    renderRack();
  }, 300);
}

function aiTurn() {
  const moves = findAIMoves();
  if (moves.length === 0) {
    logMove("AI", "PASS", 0);
    return;
  }

  const difficulty = difficultySelect.value;
  let chosen;
  if (difficulty === "easy") {
    moves.sort((a, b) => a.score - b.score);
    chosen = moves[0];
  } else if (difficulty === "medium") {
    moves.sort((a, b) => b.score - a.score);
    chosen = moves[Math.floor(Math.random() * Math.min(5, moves.length))];
  } else if (difficulty === "hard") {
    moves.sort((a, b) => b.score - a.score);
    chosen = moves[0];
  } else {
    moves.sort((a, b) => b.score - a.score);
    chosen = moves[0];
  }

  applyAIMove(chosen);
}

function applyAIMove(move) {
  move.placements.forEach((placement) => {
    const { row, col, letter, blank } = placement;
    board[row][col] = {
      letter,
      value: blank ? 0 : LETTER_VALUES[letter],
      blank: !!blank,
      locked: true
    };
  });

  removeTilesFromRack(aiRack, move.usedTiles);
  refillRack(aiRack);

  scores.ai += move.score;
  logMove("AI", move.word, move.score);
  updateScores();
}

function removeTilesFromRack(targetRack, usedTiles) {
  usedTiles.forEach((tile) => {
    const index = targetRack.findIndex((t) => t.blank === tile.blank && t.letter === tile.letter);
    if (index >= 0) targetRack.splice(index, 1);
  });
}

function findAIMoves() {
  const anchors = getAnchors();
  const moves = [];
  const crossCheck = buildCrossCheck();

  for (const anchor of anchors) {
    moves.push(...generateMoves(anchor, "row", crossCheck));
    moves.push(...generateMoves(anchor, "col", crossCheck));
  }

  return moves;
}

function getAnchors() {
  if (boardIsEmpty()) return [{ row: CENTER, col: CENTER }];
  const anchors = [];
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (board[r][c]) continue;
      const adjacent = [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
      ].some(([rr, cc]) => rr >= 0 && rr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE && board[rr][cc] && board[rr][cc].locked);
      if (adjacent) anchors.push({ row: r, col: c });
    }
  }
  return anchors;
}

function buildCrossCheck() {
  const cache = new Map();
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (board[r][c]) continue;
      cache.set(`${r},${c},row`, allowedLettersForCell(r, c, "row"));
      cache.set(`${r},${c},col`, allowedLettersForCell(r, c, "col"));
    }
  }
  return cache;
}

function allowedLettersForCell(row, col, direction) {
  const perp = direction === "row" ? "col" : "row";
  const prefix = collectLetters(row, col, perp, -1);
  const suffix = collectLetters(row, col, perp, 1);
  if (prefix.length === 0 && suffix.length === 0) return new Set(ALPHABET);
  const allowed = new Set();
  for (const letter of ALPHABET) {
    const word = `${prefix}${letter}${suffix}`;
    if (dictionary.has(word)) allowed.add(letter);
  }
  return allowed;
}

function collectLetters(row, col, direction, step) {
  let r = row;
  let c = col;
  const letters = [];
  while (true) {
    if (direction === "row") c += step;
    else r += step;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
    const tile = board[r][c];
    if (!tile) break;
    letters[step === -1 ? "unshift" : "push"](tile.letter);
  }
  return letters.join("");
}

function generateMoves(anchor, direction, crossCheck) {
  const moves = [];
  const lineIndex = direction === "row" ? anchor.row : anchor.col;
  const anchorPos = direction === "row" ? anchor.col : anchor.row;
  const maxStart = Math.max(0, anchorPos - 14);

  for (let start = maxStart; start <= anchorPos; start += 1) {
    const before = start - 1;
    if (before >= 0) {
      const beforeTile = direction === "row" ? board[lineIndex][before] : board[before][lineIndex];
      if (beforeTile) continue;
    }
    dfsBuildWord({
      start,
      pos: start,
      anchorPos,
      direction,
      lineIndex,
      rackCounts: countRack(aiRack),
      blankCount: aiRack.filter((t) => t.blank).length,
      word: "",
      placements: [],
      usedTiles: [],
      moves,
      crossCheck
    });
  }

  return moves;
}

function dfsBuildWord(state) {
  const { pos, start, anchorPos, direction, lineIndex, word, rackCounts, blankCount, placements, usedTiles, moves, crossCheck } = state;

  if (pos >= BOARD_SIZE) return;
  const row = direction === "row" ? lineIndex : pos;
  const col = direction === "row" ? pos : lineIndex;
  const tile = board[row][col];

  const nextPos = pos + 1;
  const canStop = nextPos >= BOARD_SIZE || !board[direction === "row" ? lineIndex : nextPos][direction === "row" ? nextPos : lineIndex];

  if (tile) {
    const newWord = word + tile.letter;
    if (!prefixSet.has(newWord)) return;
    const newState = {
      ...state,
      pos: pos + 1,
      word: newWord
    };
    if (canStop && pos >= anchorPos) tryFinalizeWord(newState, direction, lineIndex, anchorPos, moves, placements, usedTiles);
    dfsBuildWord(newState);
    return;
  }

  const allowed = crossCheck.get(`${row},${col},${direction}`) || new Set(ALPHABET);

  for (const letter of ALPHABET) {
    if (!allowed.has(letter)) continue;
    let useBlank = false;
    let usedFromRack = false;
    if ((rackCounts[letter] || 0) > 0) {
      rackCounts[letter] -= 1;
      usedFromRack = true;
    } else if (blankCount > 0) {
      useBlank = true;
    } else {
      continue;
    }

    const newWord = word + letter;
    if (prefixSet.has(newWord)) {
      const placement = { row, col, letter, blank: useBlank };
      placements.push(placement);
      usedTiles.push({ letter: useBlank ? "?" : letter, blank: useBlank });

      const newState = {
        ...state,
        pos: pos + 1,
        word: newWord,
        blankCount: useBlank ? blankCount - 1 : blankCount
      };
      if (canStop && pos >= anchorPos) tryFinalizeWord(newState, direction, lineIndex, anchorPos, moves, placements, usedTiles);
      dfsBuildWord(newState);

      placements.pop();
      usedTiles.pop();
    }

    if (usedFromRack) rackCounts[letter] += 1;
  }
}

function tryFinalizeWord(state, direction, lineIndex, anchorPos, moves, placements, usedTiles) {
  if (state.word.length < 2) return;
  if (!dictionary.has(state.word)) return;
  if (!placements.some((p) => (direction === "row" ? p.col : p.row) === anchorPos)) return;

  const start = state.start;
  const end = state.start + state.word.length - 1;
  const after = end + 1;
  if (after < BOARD_SIZE) {
    const afterTile = direction === "row" ? board[lineIndex][after] : board[after][lineIndex];
    if (afterTile) return;
  }

  for (const placement of placements) {
    const cross = getCrossWord(placement.row, placement.col, placement.letter, direction);
    if (cross.length > 1 && !dictionary.has(cross.word)) return;
  }

  const score = scoreWordAI(state.word, placements, direction, lineIndex, start);
  moves.push({ word: state.word, placements: [...placements], usedTiles: [...usedTiles], score });
}

function getCrossWord(row, col, letter, direction) {
  const perp = direction === "row" ? "col" : "row";
  const prefix = collectLetters(row, col, perp, -1);
  const suffix = collectLetters(row, col, perp, 1);
  return { word: `${prefix}${letter}${suffix}`, length: prefix.length + suffix.length + 1 };
}

function scoreWordAI(word, placements, direction, lineIndex, start) {
  let score = 0;
  let wordMultiplier = 1;

  for (let i = 0; i < word.length; i += 1) {
    const row = direction === "row" ? lineIndex : start + i;
    const col = direction === "row" ? start + i : lineIndex;
    const existing = board[row][col];
    const letter = word[i];
    let letterScore = existing ? existing.value : LETTER_VALUES[letter];
    if (!existing) {
      const placement = placements.find((p) => p.row === row && p.col === col);
      if (placement && placement.blank) letterScore = 0;
      const type = getCellType(row, col);
      if (type === "double-letter") letterScore *= 2;
      if (type === "triple-letter") letterScore *= 3;
      if (type === "double-word") wordMultiplier *= 2;
      if (type === "triple-word") wordMultiplier *= 3;
    }
    score += letterScore;
  }

  let total = score * wordMultiplier;

  for (const placement of placements) {
    const cross = getCrossWord(placement.row, placement.col, placement.letter, direction);
    if (cross.length > 1) {
      const crossScore = scoreCrossWord(placement, direction);
      total += crossScore;
    }
  }

  if (placements.length === 7) total += 50;
  return total;
}

function scoreCrossWord(placement, direction) {
  const perp = direction === "row" ? "col" : "row";
  const prefix = collectLetters(placement.row, placement.col, perp, -1);
  const suffix = collectLetters(placement.row, placement.col, perp, 1);
  const word = `${prefix}${placement.letter}${suffix}`;
  if (word.length < 2) return 0;

  let score = 0;
  let wordMultiplier = 1;
  for (let i = 0; i < word.length; i += 1) {
    const row = perp === "row" ? placement.row : placement.row - prefix.length + i;
    const col = perp === "row" ? placement.col - prefix.length + i : placement.col;
    const existing = board[row][col];
    let letterScore = existing ? existing.value : LETTER_VALUES[word[i]];
    if (!existing) {
      if (placement.blank) letterScore = 0;
      const type = getCellType(row, col);
      if (type === "double-letter") letterScore *= 2;
      if (type === "triple-letter") letterScore *= 3;
      if (type === "double-word") wordMultiplier *= 2;
      if (type === "triple-word") wordMultiplier *= 3;
    }
    score += letterScore;
  }
  return score * wordMultiplier;
}

function countRack(tiles) {
  return tiles.reduce((acc, tile) => {
    if (!tile.blank) acc[tile.letter] = (acc[tile.letter] || 0) + 1;
    return acc;
  }, {});
}

function setDictionary() {
  const mode = seedSelect.value;
  if (mode === "classic" || !window.WORD_LIST) {
    dictionaryArray = SMALL_WORD_LIST.slice();
  } else {
    dictionaryArray = window.WORD_LIST.slice();
  }
  dictionary = new Set(dictionaryArray.map((w) => w.toUpperCase()));
  prefixSet = new Set();
  for (const word of dictionaryArray) {
    const upper = word.toUpperCase();
    for (let i = 1; i <= upper.length; i += 1) {
      prefixSet.add(upper.slice(0, i));
    }
  }
}

function resetGame() {
  initBoard();
  buildBag();
  rack = [];
  aiRack = [];
  scores = { player: 0, ai: 0 };
  placedThisTurn = [];
  selectedRackIndex = null;
  isPlayerTurn = true;
  setDictionary();
  refillRack(rack);
  refillRack(aiRack);
  logEl.innerHTML = "";
  updateScores();
  renderBoard();
  renderRack();
  turnStatusEl.textContent = "Your move";
}

function applyTransform() {
  boardInner.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  zoomSlider.value = view.scale.toFixed(2);
}

function handleZoom(event) {
  const delta = Math.sign(event.deltaY) * -0.05;
  const newScale = Math.min(1.8, Math.max(0.6, view.scale + delta));
  if (newScale === view.scale) return;

  const rect = boardViewport.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - view.x;
  const offsetY = event.clientY - rect.top - view.y;
  const scaleFactor = newScale / view.scale;
  view.x = view.x - offsetX * (scaleFactor - 1);
  view.y = view.y - offsetY * (scaleFactor - 1);
  view.scale = newScale;
  applyTransform();
}

function startPan(event) {
  if (event.target.closest(".tile")) return;
  view.panning = true;
  view.panStart = { x: event.clientX - view.x, y: event.clientY - view.y };
  boardViewport.setPointerCapture(event.pointerId);
}

function movePan(event) {
  if (!view.panning) return;
  view.x = event.clientX - view.panStart.x;
  view.y = event.clientY - view.panStart.y;
  applyTransform();
}

function endPan(event) {
  view.panning = false;
  boardViewport.releasePointerCapture(event.pointerId);
}

boardViewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  handleZoom(event);
});
boardViewport.addEventListener("pointerdown", startPan);
boardViewport.addEventListener("pointermove", movePan);
boardViewport.addEventListener("pointerup", endPan);
boardViewport.addEventListener("pointerleave", endPan);

rackEl.addEventListener("dragover", (event) => {
  if (!isPlayerTurn) return;
  event.preventDefault();
});

rackEl.addEventListener("drop", (event) => {
  if (!isPlayerTurn) return;
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  if (!data) return;
  const payload = JSON.parse(data);
  if (payload.source === "board") {
    const tile = board[payload.row][payload.col];
    if (!tile || tile.locked) return;
    board[payload.row][payload.col] = null;
    if (tile.blank) tile.letter = "?";
    rack.push(tile);
    placedThisTurn = placedThisTurn.filter((p) => !(p.row === payload.row && p.col === payload.col));
    renderBoard();
    renderRack();
  }
});

playWordBtn.addEventListener("click", playWord);
shuffleRackBtn.addEventListener("click", shuffleRack);
recallBtn.addEventListener("click", recallTiles);
newGameBtn.addEventListener("click", resetGame);
seedSelect.addEventListener("change", resetGame);
zoomSlider.addEventListener("input", (event) => {
  view.scale = Number(event.target.value);
  applyTransform();
});
zoomResetBtn.addEventListener("click", () => {
  view = { scale: 1, x: 0, y: 0, panning: false, panStart: null };
  applyTransform();
});

resetGame();
applyTransform();
