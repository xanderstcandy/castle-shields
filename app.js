const app = document.querySelector("#app");
const ACCOUNTS_KEY = "castleShieldsAccounts";
const LEGACY_ACCOUNTS_KEY = "castleSheildsAccounts";
const TOWER_IDS = ["nw", "ne", "sw", "se"];
const ENEMY_TYPES = [
  "zombie",
  "crawler",
  "goblin",
  "troll",
  "wraith",
  "ogre",
  "monster",
  "brute",
  "fiend",
  "behemoth"
];

const TOWER_NAMES = {
  nw: "Northwest Tower",
  ne: "Northeast Tower",
  sw: "Southwest Tower",
  se: "Southeast Tower"
};

const WAVE_PEACE_MS = 10000;
const WAVE_ATTACK_MS = 60000;
const SPAWN_INTERVAL_MS = 3200;
const PEACE_REGEN_CAP_RATIO = 0.1;
const WAVE_SCALE_PER_LEVEL = 0.03;
const GOLD_REWARD_MULTIPLIER = 0.72;
const CASTLE_TARGET = { x: 50, y: 27 };
const CASTLE_ATTACK_RANGE = 5.5;
const ENEMY_SPEED_MULTIPLIER = 0.45;
const TROOP_SPEED_MULTIPLIER = 0.765;
const ENEMY_STAT_MULTIPLIER = 0.55;
const ARROW_SPEED = 0.38;
const TOWER_RANGE = 58;

const TOWER_POSITIONS = {
  nw: { x: 44, y: 11 },
  ne: { x: 56, y: 11 },
  sw: { x: 44, y: 24 },
  se: { x: 56, y: 24 }
};

const TOWER_IDLE_ANGLES = {
  nw: -45,
  ne: 45,
  sw: -135,
  se: 135
};

const TOWER_AIM_TURN_SPEED = 220;

const BOTTOM_HALF_TREES = [
  { top: 52, left: 90 },
  { top: 58, left: 92 },
  { top: 62, left: 6 },
  { top: 66, left: 48 },
  { top: 68, left: 86 },
  { top: 72, left: 8 },
  { top: 74, left: 54 },
  { top: 78, left: 22 },
  { top: 80, left: 78 },
  { top: 84, left: 12 },
  { top: 88, left: 66 }
];

const ENEMY_DEFS = {
  zombie: {
    label: "Zombie",
    badge: "Rot",
    color: "#166534",
    scale: 1,
    shape: "normal",
    minWave: 1,
    spawnWeight: 5,
    health: 28,
    damage: 4,
    speed: 10.5,
    gold: 6,
    diamonds: 0
  },
  crawler: {
    label: "Crawler",
    badge: "Fast",
    color: "#4d7c0f",
    scale: 0.82,
    shape: "small",
    minWave: 1,
    spawnWeight: 4,
    health: 18,
    damage: 3,
    speed: 9.5,
    gold: 5,
    diamonds: 0
  },
  goblin: {
    label: "Goblin",
    badge: "Sly",
    color: "#84cc16",
    scale: 0.88,
    shape: "small",
    minWave: 2,
    spawnWeight: 4,
    health: 22,
    damage: 5,
    speed: 8.5,
    gold: 8,
    diamonds: 0
  },
  troll: {
    label: "Troll",
    badge: "Tough",
    color: "#c2410c",
    scale: 1.18,
    shape: "bulky",
    minWave: 3,
    spawnWeight: 3,
    health: 68,
    damage: 11,
    speed: 6.5,
    gold: 15,
    diamonds: 0,
    diamondChance: 0.35,
    diamondMax: 1
  },
  wraith: {
    label: "Wraith",
    badge: "Ghost",
    color: "#0891b2",
    scale: 0.95,
    shape: "ghost",
    minWave: 4,
    spawnWeight: 3,
    health: 24,
    damage: 7,
    speed: 10,
    gold: 10,
    diamonds: 0
  },
  ogre: {
    label: "Ogre",
    badge: "Crush",
    color: "#991b1b",
    scale: 1.28,
    shape: "bulky",
    minWave: 5,
    spawnWeight: 2,
    health: 95,
    damage: 14,
    speed: 5.5,
    gold: 22,
    diamonds: 0,
    diamondChance: 0.45,
    diamondMax: 1
  },
  monster: {
    label: "Monster",
    badge: "Curse",
    color: "#7c3aed",
    scale: 1.12,
    shape: "horned",
    minWave: 6,
    spawnWeight: 3,
    health: 115,
    damage: 17,
    speed: 6.5,
    gold: 28,
    diamonds: 1
  },
  brute: {
    label: "Brute",
    badge: "Armor",
    color: "#475569",
    scale: 1.22,
    shape: "bulky",
    minWave: 7,
    spawnWeight: 2,
    health: 140,
    damage: 12,
    speed: 5,
    gold: 24,
    diamonds: 0,
    diamondChance: 0.5,
    diamondMax: 1
  },
  fiend: {
    label: "Fiend",
    badge: "Burn",
    color: "#dc2626",
    scale: 1.08,
    shape: "horned",
    minWave: 8,
    spawnWeight: 2,
    health: 88,
    damage: 22,
    speed: 7.5,
    gold: 32,
    diamonds: 1,
    diamondMax: 2
  },
  behemoth: {
    label: "Behemoth",
    badge: "Boss",
    color: "#581c87",
    scale: 1.42,
    shape: "horned",
    minWave: 10,
    spawnWeight: 1,
    health: 210,
    damage: 28,
    speed: 4.5,
    gold: 48,
    diamonds: 2,
    diamondMax: 3
  }
};

const BUILDING_IDS = ["farm", "barracks", "stables", "archery"];
const MILITARY_BUILDING_IDS = ["barracks", "stables", "archery"];

const BUILDING_SLOT_LAYOUT = {
  farm: "castle-building-slot-nw",
  barracks: "castle-building-slot-ne",
  stables: "castle-building-slot-sw",
  archery: "castle-building-slot-se"
};

const BUILDING_DEFS = {
  farm: {
    label: "Farm",
    buildCost: 100,
    desc: "Feeds your realm and raises population capacity."
  },
  barracks: {
    label: "Barracks",
    buildCost: 130,
    desc: "Foot soldiers for the front line."
  },
  stables: {
    label: "Stables",
    buildCost: 155,
    desc: "Fast cavalry to chase enemies down."
  },
  archery: {
    label: "Shooting Range",
    buildCost: 140,
    desc: "Train ranged troops and extend crossbow tower range."
  }
};

const MAX_BUILDING_LEVEL = 3;
const BASE_POPULATION = 10;
const POPULATION_PER_FARM_LEVEL = 15;

const TROOP_DEFS = {
  militia: { label: "Militia", building: "barracks", minLevel: 1, health: 24, damage: 6, speed: 9, range: 2.5, attackMs: 900, cost: 12, population: 1, color: "#64748b" },
  swordsman: { label: "Swordsman", building: "barracks", minLevel: 2, health: 42, damage: 11, speed: 8, range: 2.5, attackMs: 800, cost: 24, population: 2, color: "#475569" },
  knight: { label: "Knight", building: "barracks", minLevel: 3, health: 75, damage: 18, speed: 7, range: 3, attackMs: 1000, cost: 48, population: 3, color: "#1e293b" },
  scout: { label: "Scout", building: "stables", minLevel: 1, health: 20, damage: 7, speed: 13, range: 2.5, attackMs: 700, cost: 16, population: 1, color: "#a16207" },
  horseman: { label: "Horseman", building: "stables", minLevel: 2, health: 38, damage: 13, speed: 11, range: 3, attackMs: 850, cost: 32, population: 2, color: "#92400e" },
  lancer: { label: "Lancer", building: "stables", minLevel: 3, health: 68, damage: 21, speed: 10, range: 3.5, attackMs: 950, cost: 55, population: 3, color: "#78350f" },
  archer: { label: "Archer", building: "archery", minLevel: 1, health: 18, damage: 8, speed: 5.5, range: 14, attackMs: 1100, cost: 14, population: 1, color: "#166534" },
  crossbowman: { label: "Crossbowman", building: "archery", minLevel: 2, health: 28, damage: 15, speed: 4.5, range: 12, attackMs: 1300, cost: 28, population: 2, color: "#14532d" },
  ranger: { label: "Ranger", building: "archery", minLevel: 3, health: 22, damage: 22, speed: 5, range: 18, attackMs: 1200, cost: 50, population: 3, color: "#052e16" }
};

const state = {
  screen: "loading",
  username: "",
  shopOpen: false,
  selectedTower: "",
  castlePanelOpen: false,
  militaryPanelOpen: false,
  selectedBuilding: "",
  gold: 100,
  diamonds: 0,
  towers: createDefaultTowers(),
  castle: createDefaultCastle(),
  buildings: createDefaultBuildings(),
  army: createDefaultArmy(),
  jobQueue: [],
  nextJobId: 1,
  castleHealth: 100,
  shopMessage: "",
  shopMessageType: "",
  towerMessage: "",
  towerMessageType: "",
  castleMessage: "",
  castleMessageType: "",
  militaryMessage: "",
  militaryMessageType: "",
  buildingMessage: "",
  buildingMessageType: "",
  gameOver: false,
  error: "",
  success: ""
};

const combat = {
  enemies: [],
  arrows: [],
  troops: [],
  phase: "peace",
  waveNumber: 1,
  phaseEndsAt: 0,
  lastSpawnAt: 0,
  nextEnemyId: 1,
  nextArrowId: 1,
  nextTroopId: 1,
  loopRunning: false,
  loopFrame: 0,
  lastFrameTime: 0,
  lastFireTimes: {
    nw: 0,
    ne: 0,
    sw: 0,
    se: 0
  },
  towerAimAngles: {
    nw: TOWER_IDLE_ANGLES.nw,
    ne: TOWER_IDLE_ANGLES.ne,
    sw: TOWER_IDLE_ANGLES.sw,
    se: TOWER_IDLE_ANGLES.se
  },
  lastSpawnWallAt: 0,
  peaceRegenUsed: 0,
  lastHudRefresh: 0
};

let combatLayer = null;

function createDefaultTower() {
  return {
    arrowDamage: 1,
    dex: 1,
    arrowDamageLevel: 1,
    dexLevel: 1
  };
}

function createDefaultTowers() {
  return {
    nw: createDefaultTower(),
    ne: createDefaultTower(),
    sw: createDefaultTower(),
    se: createDefaultTower()
  };
}

function createDefaultCastle() {
  return {
    healthUpgradeLevel: 1,
    regenLevel: 0
  };
}

function createDefaultBuildings() {
  return {
    farm: { level: 0 },
    barracks: { level: 0 },
    stables: { level: 0 },
    archery: { level: 0 }
  };
}

function createDefaultJobQueue() {
  return [];
}

function createDefaultCombatSave() {
  return {
    waveNumber: 1,
    phase: "peace",
    phaseEndTimestamp: Date.now() + WAVE_PEACE_MS,
    lastSpawnWallAt: 0,
    castleHealth: null,
    enemies: [],
    troops: [],
    arrows: [],
    nextEnemyId: 1,
    nextArrowId: 1,
    nextTroopId: 1,
    lastFireTimes: {
      nw: 0,
      ne: 0,
      sw: 0,
      se: 0
    },
    towerAimAngles: {
      nw: TOWER_IDLE_ANGLES.nw,
      ne: TOWER_IDLE_ANGLES.ne,
      sw: TOWER_IDLE_ANGLES.sw,
      se: TOWER_IDLE_ANGLES.se
    }
  };
}

function serializeCombatSave() {
  const phaseRemainingMs = Math.max(0, combat.phaseEndsAt - performance.now());
  return {
    waveNumber: combat.waveNumber,
    phase: combat.phase,
    phaseEndTimestamp: Date.now() + phaseRemainingMs,
    lastSpawnWallAt: combat.lastSpawnWallAt || 0,
    castleHealth: state.castleHealth,
    enemies: structuredClone(combat.enemies),
    troops: structuredClone(combat.troops),
    arrows: structuredClone(combat.arrows),
    nextEnemyId: combat.nextEnemyId,
    nextArrowId: combat.nextArrowId,
    nextTroopId: combat.nextTroopId,
    towerAimAngles: structuredClone(combat.towerAimAngles)
  };
}

function fastForwardCombatSave(saved) {
  let waveNumber = saved.waveNumber || 1;
  let phase = saved.phase || "peace";
  let phaseEndTimestamp = saved.phaseEndTimestamp || Date.now() + WAVE_PEACE_MS;
  let enemies = structuredClone(saved.enemies || []);
  let troops = structuredClone(saved.troops || []);
  let arrows = structuredClone(saved.arrows || []);

  while (phaseEndTimestamp <= Date.now()) {
    if (phase === "peace") {
      phase = "attack";
      phaseEndTimestamp += WAVE_ATTACK_MS;
      enemies = [];
      troops = [];
      arrows = [];
    } else {
      phase = "peace";
      phaseEndTimestamp += WAVE_PEACE_MS;
      waveNumber += 1;
      enemies = [];
      troops = [];
      arrows = [];
    }
  }

  return {
    ...saved,
    waveNumber,
    phase,
    phaseEndTimestamp,
    enemies,
    troops,
    arrows
  };
}

function applyCombatSave(saved) {
  const progressed = fastForwardCombatSave(saved);
  const phaseRemainingMs = Math.max(0, progressed.phaseEndTimestamp - Date.now());

  combat.waveNumber = progressed.waveNumber;
  combat.phase = progressed.phase;
  combat.phaseEndsAt = performance.now() + phaseRemainingMs;
  combat.enemies = progressed.enemies;
  combat.troops = progressed.troops;
  combat.arrows = progressed.arrows;
  combat.nextEnemyId = progressed.nextEnemyId || 1;
  combat.nextArrowId = progressed.nextArrowId || 1;
  combat.nextTroopId = progressed.nextTroopId || 1;
  combat.lastFireTimes = {
    nw: 0,
    ne: 0,
    sw: 0,
    se: 0
  };
  combat.towerAimAngles = {
    nw: TOWER_IDLE_ANGLES.nw,
    ne: TOWER_IDLE_ANGLES.ne,
    sw: TOWER_IDLE_ANGLES.sw,
    se: TOWER_IDLE_ANGLES.se,
    ...progressed.towerAimAngles
  };

  if (combat.phase === "attack" && progressed.lastSpawnWallAt) {
    combat.lastSpawnAt = performance.now() - (Date.now() - progressed.lastSpawnWallAt);
  } else {
    combat.lastSpawnAt = 0;
  }

  combat.lastSpawnWallAt = progressed.lastSpawnWallAt || 0;
  combat.lastFrameTime = 0;
  state.castleHealth = progressed.castleHealth ?? getCastleMaxHealth();

  if (state.castleHealth <= 0) {
    handlePlayerDeath(false);
    return false;
  }

  return true;
}

function resetAccountProgressToDefault() {
  state.gold = 100;
  state.diamonds = 0;
  state.towers = createDefaultTowers();
  state.castle = createDefaultCastle();
  state.buildings = createDefaultBuildings();
  state.army = createDefaultArmy();
  state.jobQueue = createDefaultJobQueue();
  state.nextJobId = 1;
  state.shopOpen = false;
  state.militaryPanelOpen = false;
  state.selectedTower = "";
  state.selectedBuilding = "";
  state.castlePanelOpen = false;
  state.shopMessage = "";
  state.towerMessage = "";
  state.castleMessage = "";
  state.militaryMessage = "";
  state.buildingMessage = "";
}

function startFreshCombat() {
  resetCombatState();
  combat.phaseEndsAt = performance.now() + WAVE_PEACE_MS;
  state.castleHealth = getCastleMaxHealth();
}

function refreshCombatHud() {
  updateWaveHud();
  updateCastleHealthDisplay();
}

function handlePlayerDeath(shouldRender = true) {
  if (state.gameOver) {
    if (state.castleHealth <= 0) {
      state.castleHealth = getCastleMaxHealth();
      if (state.username) saveAccountProgress(state.username);
      refreshCombatHud();
      if (shouldRender) render();
    }
    return;
  }

  state.gameOver = true;
  resetAccountProgressToDefault();
  startFreshCombat();
  state.castleHealth = getCastleMaxHealth();
  if (state.username) saveAccountProgress(state.username);
  refreshCombatHud();
  if (shouldRender) render();
}

function dismissGameOver() {
  state.gameOver = false;
  if (state.castleHealth <= 0) {
    state.castleHealth = getCastleMaxHealth();
    if (state.username) saveAccountProgress(state.username);
  }
  refreshCombatHud();
  render();
}

function getMaxPopulation() {
  const farmLevel = state.buildings.farm?.level || 0;
  return BASE_POPULATION + farmLevel * POPULATION_PER_FARM_LEVEL;
}

function getTroopPopulationCost(troopType) {
  return TROOP_DEFS[troopType]?.population || 1;
}

function getPopulationUsed() {
  let used = 0;

  for (const [troopType, count] of Object.entries(state.army)) {
    used += count * getTroopPopulationCost(troopType);
  }

  for (const job of state.jobQueue) {
    if (job.kind === "train") {
      used += job.population || getTroopPopulationCost(job.troopType);
    }
  }

  return used;
}

function getAvailablePopulation() {
  return getMaxPopulation() - getPopulationUsed();
}

function getBuildDurationMs(buildingId, fromLevel) {
  if (fromLevel === 0) {
    return buildingId === "farm" ? 50000 : 70000;
  }
  return 45000 + fromLevel * 22000;
}

function getTrainDurationMs(troopType) {
  const def = TROOP_DEFS[troopType];
  return 12000 + def.cost * 700;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

function hasActiveBuildJob(buildingId) {
  return state.jobQueue.some((job) => job.kind === "build" && job.buildingId === buildingId);
}

function hasActiveTrainJob(buildingId) {
  return state.jobQueue.some((job) => {
    if (job.kind !== "train") return false;
    return TROOP_DEFS[job.troopType].building === buildingId;
  });
}

function getActiveBuildJob(buildingId) {
  return state.jobQueue.find((job) => job.kind === "build" && job.buildingId === buildingId);
}

function getActiveTrainJobsForBuilding(buildingId) {
  return state.jobQueue.filter((job) => {
    if (job.kind !== "train") return false;
    return TROOP_DEFS[job.troopType].building === buildingId;
  });
}

function completeJob(job) {
  if (job.kind === "build") {
    state.buildings[job.buildingId].level = job.targetLevel;
    const label = BUILDING_DEFS[job.buildingId].label;
    if (job.buildingId === "farm") {
      setCampFeedback(`${label} ready. Population cap is now ${getMaxPopulation()}.`, "success");
    } else if (job.targetLevel === 1) {
      setCampFeedback(`${label} built. New troops unlocked!`, "success");
    } else {
      setCampFeedback(`${label} upgraded to level ${job.targetLevel}.`, "success");
    }
    return;
  }

  if (job.kind === "train") {
    state.army[job.troopType] = (state.army[job.troopType] || 0) + 1;
    const label = TROOP_DEFS[job.troopType].label;
    setCampFeedback(`${label} training complete. ${getArmyCount()} troops ready.`, "success");
  }
}

function processJobQueue(now) {
  if (!state.jobQueue.length) return false;

  let changed = false;
  const remaining = [];

  for (const job of state.jobQueue) {
    if (now >= job.completesAt) {
      completeJob(job);
      changed = true;
    } else {
      remaining.push(job);
    }
  }

  state.jobQueue = remaining;
  if (changed) {
    saveAccountProgress(state.username);
  }
  return changed;
}

function renderJobProgress(job, now) {
  const remainingMs = Math.max(0, job.completesAt - now);
  const totalMs = job.completesAt - job.startedAt;
  const progress = totalMs > 0 ? Math.min(100, ((totalMs - remainingMs) / totalMs) * 100) : 100;
  const label = job.kind === "build"
    ? `${BUILDING_DEFS[job.buildingId].label} → Lv ${job.targetLevel}`
    : `Training ${TROOP_DEFS[job.troopType].label}`;

  return `
    <div class="military-job-card">
      <div class="military-job-header">
        <strong>${label}</strong>
        <span>${formatDuration(remainingMs)} left</span>
      </div>
      <div class="military-job-track"><span style="width:${progress}%"></span></div>
    </div>
  `;
}

function createDefaultArmy() {
  return Object.fromEntries(Object.keys(TROOP_DEFS).map((type) => [type, 0]));
}

function getBuildingUpgradeCost(buildingId) {
  const building = state.buildings[buildingId];
  if (building.level === 0) return BUILDING_DEFS[buildingId].buildCost;
  if (buildingId === "farm") return 75 * building.level;
  return 95 * building.level;
}

function isTroopUnlocked(troopType) {
  const def = TROOP_DEFS[troopType];
  return state.buildings[def.building].level >= def.minLevel;
}

function getArmyCount() {
  return Object.values(state.army).reduce((sum, count) => sum + count, 0);
}

function getTowerRange() {
  const shootingRangeLevel = state.buildings.archery?.level || 0;
  return TOWER_RANGE + shootingRangeLevel * 4;
}

function getCastleMaxHealth() {
  return 100 + (state.castle.healthUpgradeLevel - 1) * 35;
}

function getCastleRegenPerSecond() {
  return state.castle.regenLevel * 2;
}

function getCastleHealthUpgradeCost() {
  return 110 * state.castle.healthUpgradeLevel;
}

function getCastleRegenUpgradeCost() {
  return 8 + state.castle.regenLevel * 6;
}

function template(content, className = "center") {
  app.innerHTML = `<section class="screen ${className}">${content}</section>`;
}

function render() {
  if (state.screen === "loading") return renderStudioIntro();
  if (state.screen === "sign-in") return renderSignIn();
  if (state.screen === "create-account") return renderCreateAccount();
  if (state.screen === "castle") {
    renderCastle();
    syncCombatLayer();
    updateWaveHud();
    applyTowerCrossbowTransforms();
    if (!combat.loopRunning) startCombatLoop(true);
  }
}

function loadAccounts() {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (saved) return JSON.parse(saved);

    const legacy = localStorage.getItem(LEGACY_ACCOUNTS_KEY);
    if (legacy) {
      localStorage.setItem(ACCOUNTS_KEY, legacy);
      return JSON.parse(legacy);
    }

    return [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function findAccount(username, password) {
  const normalizedUsername = username.toLowerCase();
  return loadAccounts().find(
    (account) => account.username.toLowerCase() === normalizedUsername && account.password === password
  );
}

function usernameTaken(username) {
  const normalizedUsername = username.toLowerCase();
  return loadAccounts().some((account) => account.username.toLowerCase() === normalizedUsername);
}

function passwordTaken(password) {
  return loadAccounts().some((account) => account.password === password);
}

function ensureAccountTowers(account) {
  if (!account.towers) account.towers = createDefaultTowers();
  for (const towerId of TOWER_IDS) {
    if (!account.towers[towerId]) account.towers[towerId] = createDefaultTower();
    const tower = account.towers[towerId];
    if (tower.arrowDamage === undefined) tower.arrowDamage = 1;
    if (tower.dex === undefined) tower.dex = 1;
    if (tower.arrowDamageLevel === undefined) tower.arrowDamageLevel = 1;
    if (tower.dexLevel === undefined) tower.dexLevel = 1;
  }
}

function ensureAccountCastle(account) {
  if (!account.castle) account.castle = createDefaultCastle();
  if (account.castle.healthUpgradeLevel === undefined) account.castle.healthUpgradeLevel = 1;
  if (account.castle.regenLevel === undefined) account.castle.regenLevel = 0;
}

function ensureAccountBuildings(account) {
  if (!account.buildings) account.buildings = createDefaultBuildings();
  for (const buildingId of BUILDING_IDS) {
    if (!account.buildings[buildingId]) account.buildings[buildingId] = { level: 0 };
    if (account.buildings[buildingId].level === undefined) account.buildings[buildingId].level = 0;
  }
}

function ensureAccountArmy(account) {
  if (!account.army) account.army = createDefaultArmy();
  for (const troopType of Object.keys(TROOP_DEFS)) {
    if (account.army[troopType] === undefined) account.army[troopType] = 0;
  }
}

function ensureAccountJobQueue(account) {
  if (!account.jobQueue) account.jobQueue = createDefaultJobQueue();
  if (account.nextJobId === undefined) account.nextJobId = 1;
}

function ensureAccountCombat(account) {
  if (!account.combat) {
    account.combat = createDefaultCombatSave();
  }
  if (account.combat.waveNumber === undefined) account.combat.waveNumber = 1;
  if (!account.combat.phase) account.combat.phase = "peace";
  if (!account.combat.phaseEndTimestamp) account.combat.phaseEndTimestamp = Date.now() + WAVE_PEACE_MS;
  if (!account.combat.enemies) account.combat.enemies = [];
  if (!account.combat.troops) account.combat.troops = [];
  if (!account.combat.arrows) account.combat.arrows = [];
  if (account.combat.nextEnemyId === undefined) account.combat.nextEnemyId = 1;
  if (account.combat.nextArrowId === undefined) account.combat.nextArrowId = 1;
  if (account.combat.nextTroopId === undefined) account.combat.nextTroopId = 1;
  if (!account.combat.lastFireTimes) account.combat.lastFireTimes = createDefaultCombatSave().lastFireTimes;
  if (!account.combat.towerAimAngles) account.combat.towerAimAngles = createDefaultCombatSave().towerAimAngles;
}

function processOverdueJobs() {
  const now = performance.now();
  while (state.jobQueue.some((job) => now >= job.completesAt)) {
    processJobQueue(now);
  }
}

function syncAccountProgress(username) {
  const accounts = loadAccounts();
  const normalizedUsername = username.toLowerCase();
  const account = accounts.find((entry) => entry.username.toLowerCase() === normalizedUsername);
  if (!account) {
    state.gold = 100;
    state.diamonds = 0;
    state.towers = createDefaultTowers();
    state.castle = createDefaultCastle();
    state.buildings = createDefaultBuildings();
    state.army = createDefaultArmy();
    state.jobQueue = createDefaultJobQueue();
    state.nextJobId = 1;
    startFreshCombat();
    return;
  }
  if (account.gold === undefined) account.gold = 100;
  if (account.diamonds === undefined) account.diamonds = 0;
  ensureAccountTowers(account);
  ensureAccountCastle(account);
  ensureAccountBuildings(account);
  ensureAccountArmy(account);
  ensureAccountJobQueue(account);
  ensureAccountCombat(account);
  state.gold = account.gold;
  state.diamonds = account.diamonds;
  state.towers = structuredClone(account.towers);
  state.castle = structuredClone(account.castle);
  state.buildings = structuredClone(account.buildings);
  state.army = structuredClone(account.army);
  state.jobQueue = structuredClone(account.jobQueue);
  state.nextJobId = account.nextJobId;
  processOverdueJobs();
  applyCombatSave(structuredClone(account.combat));
  account.gold = state.gold;
  account.diamonds = state.diamonds;
  account.towers = structuredClone(state.towers);
  account.castle = structuredClone(state.castle);
  account.buildings = structuredClone(state.buildings);
  account.army = structuredClone(state.army);
  account.jobQueue = structuredClone(state.jobQueue);
  account.nextJobId = state.nextJobId;
  if (state.screen === "castle") {
    account.combat = serializeCombatSave();
  }
  saveAccounts(accounts);
}

function saveAccountProgress(username) {
  const accounts = loadAccounts();
  const normalizedUsername = username.toLowerCase();
  const index = accounts.findIndex((entry) => entry.username.toLowerCase() === normalizedUsername);
  if (index === -1) return;
  accounts[index].gold = state.gold;
  accounts[index].diamonds = state.diamonds;
  accounts[index].towers = structuredClone(state.towers);
  accounts[index].castle = structuredClone(state.castle);
  accounts[index].buildings = structuredClone(state.buildings);
  accounts[index].army = structuredClone(state.army);
  accounts[index].jobQueue = structuredClone(state.jobQueue);
  accounts[index].nextJobId = state.nextJobId;
  if (state.screen === "castle") {
    accounts[index].combat = serializeCombatSave();
  }
  saveAccounts(accounts);
}

function damageCastle(amount) {
  if (state.gameOver || state.castleHealth <= 0) return;
  state.castleHealth = Math.max(0, state.castleHealth - amount);
  updateCastleHealthDisplay();
  if (state.castleHealth <= 0) {
    handlePlayerDeath();
  }
}

function updateCastleRegen(deltaSeconds) {
  if (combat.phase !== "peace") return;
  if (state.castleHealth <= 0) {
    handlePlayerDeath(false);
    refreshCombatHud();
    return;
  }
  const maxHealth = getCastleMaxHealth();
  if (state.castleHealth >= maxHealth) return;

  const regen = getCastleRegenPerSecond();
  if (regen <= 0) return;

  const peaceRegenCap = Math.floor(maxHealth * PEACE_REGEN_CAP_RATIO);
  const regenRemaining = Math.max(0, peaceRegenCap - (combat.peaceRegenUsed || 0));
  if (regenRemaining <= 0) return;

  const amount = Math.min(regenRemaining, regen * deltaSeconds);
  state.castleHealth = Math.min(maxHealth, state.castleHealth + amount);
  combat.peaceRegenUsed += amount;
  updateCastleHealthDisplay();
}

function getTowerFireCooldownMs(dex) {
  return Math.max(450, 1800 - dex * 120);
}

function getWaveMultiplier(wave) {
  return 1 + (wave - 1) * WAVE_SCALE_PER_LEVEL;
}

function pickEnemyType(wave) {
  const pool = Object.entries(ENEMY_DEFS).flatMap(([type, def]) => {
    if (wave < (def.minWave || 1)) return [];
    return Array(def.spawnWeight || 1).fill(type);
  });

  if (pool.length === 0) return "zombie";
  return pool[Math.floor(Math.random() * pool.length)];
}

function getEnemyRewards(type, wave) {
  const def = ENEMY_DEFS[type];
  const multiplier = getWaveMultiplier(wave);
  let diamonds = def.diamonds || 0;

  if (!diamonds && def.diamondChance !== undefined && Math.random() <= def.diamondChance) {
    diamonds = 1;
  }

  if (diamonds > 0 && def.diamondMax !== undefined) {
    diamonds = Math.min(def.diamondMax, diamonds + (wave >= 10 ? 1 : 0));
  }

  return {
    gold: Math.round(def.gold * multiplier * GOLD_REWARD_MULTIPLIER),
    diamonds
  };
}

function renderHumanoidSvg(def) {
  const shape = def.shape || "normal";
  const headRadius = shape === "bulky" ? 6 : shape === "small" ? 4.2 : 5;
  const headY = shape === "small" ? 6.5 : 7;
  const bodyX = shape === "bulky" ? 9 : shape === "small" ? 12 : 11;
  const bodyWidth = shape === "bulky" ? 14 : shape === "small" ? 8 : 10;
  const bodyHeight = shape === "bulky" ? 16 : shape === "small" ? 11 : 14;
  const bodyY = shape === "small" ? 12 : 13;
  const armWidth = shape === "bulky" ? 5 : shape === "small" ? 3 : 4;
  const armHeight = shape === "bulky" ? 18 : shape === "small" ? 12 : 16;
  const legWidth = shape === "bulky" ? 5 : shape === "small" ? 3.2 : 4;
  const legHeight = shape === "bulky" ? 19 : shape === "small" ? 14 : 18;
  const legY = bodyY + bodyHeight - 1;
  const horns = shape === "horned"
    ? `<polygon points="10,${headY - 4} 12,${headY - 1} 14,${headY - 4}" fill="currentColor"/><polygon points="18,${headY - 4} 20,${headY - 1} 22,${headY - 4}" fill="currentColor"/>`
    : "";
  const ghostGlow = shape === "ghost"
    ? `<circle cx="16" cy="24" r="15" fill="currentColor" opacity="0.18"/>`
    : "";

  return `
    <svg class="combat-enemy-figure" viewBox="0 0 32 48" aria-hidden="true">
      ${ghostGlow}
      <circle cx="16" cy="${headY}" r="${headRadius}" fill="currentColor"/>
      ${horns}
      <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" rx="3" fill="currentColor"/>
      <rect x="${bodyX - armWidth - 2}" y="${bodyY + 1}" width="${armWidth}" height="${armHeight}" rx="2" fill="currentColor"/>
      <rect x="${bodyX + bodyWidth + 2}" y="${bodyY + 1}" width="${armWidth}" height="${armHeight}" rx="2" fill="currentColor"/>
      <rect x="${bodyX + 1}" y="${legY}" width="${legWidth}" height="${legHeight}" rx="2" fill="currentColor"/>
      <rect x="${bodyX + bodyWidth - legWidth - 1}" y="${legY}" width="${legWidth}" height="${legHeight}" rx="2" fill="currentColor"/>
    </svg>
  `;
}

function renderEnemyUnit(enemy) {
  const def = ENEMY_DEFS[enemy.type];
  const hpPercent = Math.max(8, (enemy.health / enemy.maxHealth) * 100);

  return `
    <div
      class="combat-enemy combat-enemy-${enemy.type} combat-enemy-shape-${def.shape}"
      style="left:${enemy.x}%;top:${enemy.y}%;--enemy-color:${def.color};--enemy-scale:${def.scale};"
      title="${escapeHtml(enemy.label)} · DMG ${enemy.damage} · HP ${enemy.health}"
    >
      ${renderHumanoidSvg(def)}
      <span class="combat-enemy-badge">${escapeHtml(def.badge)}</span>
      <span class="combat-enemy-hp"><span style="width:${hpPercent}%"></span></span>
    </div>
  `;
}

function spawnEnemy() {
  const tree = BOTTOM_HALF_TREES[Math.floor(Math.random() * BOTTOM_HALF_TREES.length)];
  const type = pickEnemyType(combat.waveNumber);
  const def = ENEMY_DEFS[type];
  const multiplier = getWaveMultiplier(combat.waveNumber);
  const rewards = getEnemyRewards(type, combat.waveNumber);

  const statScale = multiplier * ENEMY_STAT_MULTIPLIER;

  combat.enemies.push({
    id: combat.nextEnemyId++,
    type,
    label: def.label,
    health: Math.max(1, Math.round(def.health * statScale)),
    maxHealth: Math.max(1, Math.round(def.health * statScale)),
    damage: Math.max(1, Math.round(def.damage * statScale)),
    speed: def.speed * ENEMY_SPEED_MULTIPLIER,
    gold: rewards.gold,
    diamonds: rewards.diamonds,
    x: tree.left,
    y: tree.top
  });
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.hypot(dx, dy);
}

function createArrow({ towerId, damage, x, y, targetX, targetY }) {
  const angle = Math.atan2(targetY - y, targetX - x);
  const arrow = {
    id: combat.nextArrowId++,
    towerId,
    damage,
    x,
    y,
    vx: Math.cos(angle) * ARROW_SPEED,
    vy: Math.sin(angle) * ARROW_SPEED
  };
  combat.arrows.push(arrow);
  return arrow;
}

function canTowerFire(towerId, now, cooldown) {
  const lastFire = combat.lastFireTimes[towerId] || 0;
  if (lastFire > now) return true;
  return now - lastFire >= cooldown;
}

function findTargetForTower(towerId) {
  const origin = TOWER_POSITIONS[towerId];
  let closest = null;
  let closestDistance = getTowerRange();

  for (const enemy of combat.enemies) {
    const dist = distance(origin.x, origin.y, enemy.x, enemy.y);
    if (dist <= closestDistance) {
      closest = enemy;
      closestDistance = dist;
    }
  }

  return closest;
}

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return normalized;
}

function getTowerDesiredAimAngle(towerId) {
  const target = findTargetForTower(towerId);
  if (!target) return TOWER_IDLE_ANGLES[towerId];

  const origin = TOWER_POSITIONS[towerId];
  return Math.atan2(target.y - origin.y, target.x - origin.x) * (180 / Math.PI);
}

function applyTowerCrossbowTransforms() {
  for (const towerId of TOWER_IDS) {
    const crossbow = document.querySelector(`.tower-crossbow-${towerId}`);
    if (!crossbow) continue;
    crossbow.style.setProperty("--crossbow-aim", `${combat.towerAimAngles[towerId]}deg`);
  }
}

function updateTowerCrossbowAim(deltaSeconds) {
  for (const towerId of TOWER_IDS) {
    const desired = getTowerDesiredAimAngle(towerId);
    const current = combat.towerAimAngles[towerId];
    const diff = normalizeAngle(desired - current);
    const step = TOWER_AIM_TURN_SPEED * deltaSeconds;

    if (Math.abs(diff) <= step) {
      combat.towerAimAngles[towerId] = desired;
    } else {
      combat.towerAimAngles[towerId] = current + Math.sign(diff) * step;
    }
  }

  applyTowerCrossbowTransforms();
}

function awardEnemyKill(enemy) {
  state.gold += enemy.gold;
  state.diamonds += enemy.diamonds;
  saveAccountProgress(state.username);
  updateCurrencyDisplay();
}

function removeEnemy(enemyId) {
  combat.enemies = combat.enemies.filter((enemy) => enemy.id !== enemyId);
}

function startWaveCycle(now) {
  combat.phase = "peace";
  combat.phaseEndsAt = now + WAVE_PEACE_MS;
  combat.lastSpawnAt = 0;
  combat.peaceRegenUsed = 0;
}

function beginAttackPhase(now) {
  combat.phase = "attack";
  combat.phaseEndsAt = now + WAVE_ATTACK_MS;
  combat.lastSpawnAt = now;
  combat.lastSpawnWallAt = Date.now();
  deployArmyOnAttack();
}

function endAttackPhase(now) {
  returnArmySurvivors();
  combat.enemies = [];
  combat.arrows = [];
  combat.troops = [];
  combat.waveNumber += 1;
  startWaveCycle(now);
}

function deployArmyOnAttack() {
  let slot = 0;
  const gateX = 50;
  const gateY = 27;

  for (const troopType of Object.keys(TROOP_DEFS)) {
    const count = state.army[troopType] || 0;
    if (count <= 0) continue;

    const def = TROOP_DEFS[troopType];
    state.army[troopType] = 0;

    for (let index = 0; index < count; index += 1) {
      const spread = ((slot % 7) - 3) * 2.4;
      const row = Math.floor(slot / 7);
      slot += 1;
      combat.troops.push({
        id: combat.nextTroopId++,
        type: troopType,
        label: def.label,
        health: def.health,
        maxHealth: def.health,
        damage: def.damage,
        speed: def.speed * TROOP_SPEED_MULTIPLIER,
        range: def.range,
        attackMs: def.attackMs,
        color: def.color,
        lastAttackAt: 0,
        x: gateX + spread,
        y: gateY + row * 2.2
      });
    }
  }

  if (slot > 0) saveAccountProgress(state.username);
}

function returnArmySurvivors() {
  let returned = 0;
  for (const troop of combat.troops) {
    if (troop.health <= 0) continue;
    state.army[troop.type] = (state.army[troop.type] || 0) + 1;
    returned += 1;
  }
  if (returned > 0) saveAccountProgress(state.username);
}

function findNearestEnemyForTroop(troop) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const enemy of combat.enemies) {
    const dist = distance(troop.x, troop.y, enemy.x, enemy.y);
    if (dist < nearestDistance) {
      nearest = enemy;
      nearestDistance = dist;
    }
  }

  if (!nearest) return null;
  return { enemy: nearest, dist: nearestDistance };
}

function updateTroops(deltaSeconds, now) {
  for (const troop of combat.troops) {
    const target = findNearestEnemyForTroop(troop);
    if (target) {
      const { enemy, dist } = target;
      if (dist <= troop.range) {
        if (now - troop.lastAttackAt >= troop.attackMs) {
          troop.lastAttackAt = now;
          enemy.health -= troop.damage;
          if (enemy.health <= 0) {
            awardEnemyKill(enemy);
            removeEnemy(enemy.id);
          }
        }
      } else {
        const dx = enemy.x - troop.x;
        const dy = enemy.y - troop.y;
        const step = troop.speed * deltaSeconds;
        troop.x += (dx / dist) * step;
        troop.y += (dy / dist) * step;
      }
    }

    for (const enemy of combat.enemies) {
      const dist = distance(troop.x, troop.y, enemy.x, enemy.y);
      if (dist <= 2.4) {
        troop.health -= enemy.damage * deltaSeconds * 0.45;
      }
    }
  }

  combat.troops = combat.troops.filter((troop) => troop.health > 0);
}

function renderTroopUnit(troop) {
  const hpPercent = Math.max(8, (troop.health / troop.maxHealth) * 100);
  const isRanged = troop.range > 5;

  return `
    <div
      class="combat-troop combat-troop-${isRanged ? "ranged" : "melee"}"
      style="left:${troop.x}%;top:${troop.y}%;--troop-color:${troop.color};"
      title="${escapeHtml(troop.label)} · DMG ${troop.damage} · HP ${Math.ceil(troop.health)}"
    >
      <span class="combat-troop-figure" aria-hidden="true"></span>
      <span class="combat-troop-badge">${escapeHtml(troop.label)}</span>
      <span class="combat-troop-hp"><span style="width:${hpPercent}%"></span></span>
    </div>
  `;
}

function updateWaveTiming(now) {
  if (combat.phase === "peace" && now >= combat.phaseEndsAt) {
    beginAttackPhase(now);
    return;
  }

  if (combat.phase === "attack") {
    if (now >= combat.phaseEndsAt) {
      endAttackPhase(now);
      return;
    }
    if (now - combat.lastSpawnAt >= SPAWN_INTERVAL_MS) {
      spawnEnemy();
      combat.lastSpawnAt = now;
      combat.lastSpawnWallAt = Date.now();
    }
  }
}

function updateEnemies(deltaSeconds) {
  const attackers = [];

  for (const enemy of combat.enemies) {
    const dx = CASTLE_TARGET.x - enemy.x;
    const dy = CASTLE_TARGET.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist <= CASTLE_ATTACK_RANGE) {
      attackers.push(enemy);
      continue;
    }

    const step = enemy.speed * deltaSeconds;
    enemy.x += (dx / dist) * step;
    enemy.y += (dy / dist) * step;
  }

  for (const enemy of attackers) {
    damageCastle(enemy.damage);
    removeEnemy(enemy.id);
  }
}

function updateArrows(deltaSeconds) {
  const stepScale = deltaSeconds * 60;
  const hits = [];

  for (const arrow of combat.arrows) {
    arrow.x += arrow.vx * stepScale;
    arrow.y += arrow.vy * stepScale;

    for (const enemy of combat.enemies) {
      if (distance(arrow.x, arrow.y, enemy.x, enemy.y) <= 2.2) {
        enemy.health -= arrow.damage;
        hits.push(arrow.id);
        if (enemy.health <= 0) {
          awardEnemyKill(enemy);
          removeEnemy(enemy.id);
        }
        break;
      }
    }
  }

  combat.arrows = combat.arrows.filter((arrow) => {
    if (hits.includes(arrow.id)) return false;
    return arrow.x > -2 && arrow.x < 102 && arrow.y > -2 && arrow.y < 102;
  });
}

function updateCombat(now) {
  if (state.gameOver) return;

  if (state.castleHealth <= 0) {
    handlePlayerDeath(false);
    refreshCombatHud();
    return;
  }

  const deltaSeconds = combat.lastFrameTime
    ? Math.min(0.05, (now - combat.lastFrameTime) / 1000)
    : 0.016;
  const jobsChanged = processJobQueue(now);
  updateWaveTiming(now);
  updateCastleRegen(deltaSeconds);
  updateTowerCrossbowAim(deltaSeconds);

  if (jobsChanged && state.screen === "castle") {
    render();
  } else if (now - combat.lastHudRefresh >= 500) {
    updatePopulationDisplay();
    updateJobQueueDisplay(now);
    updateBuildingSlotsDisplay(now);
    combat.lastHudRefresh = now;
  }

  if (combat.phase !== "attack") return;

  updateEnemies(deltaSeconds);
  updateTroops(deltaSeconds, now);

  for (const towerId of TOWER_IDS) {
    const target = findTargetForTower(towerId);
    if (!target) continue;

    const tower = state.towers[towerId];
    const cooldown = getTowerFireCooldownMs(tower.dex);
    if (!canTowerFire(towerId, now, cooldown)) continue;

    const origin = TOWER_POSITIONS[towerId];
    combat.lastFireTimes[towerId] = now;
    createArrow({
      towerId,
      damage: tower.arrowDamage,
      x: origin.x,
      y: origin.y,
      targetX: target.x,
      targetY: target.y
    });
  }

  updateArrows(deltaSeconds);
}

function updateCurrencyDisplay() {
  const scene = document.querySelector(".castle-scene");
  if (!scene) return;
  const goldValues = scene.querySelectorAll(".currency-pill.currency-gold .currency-value");
  const diamondValues = scene.querySelectorAll(".currency-pill.currency-diamond .currency-value");
  goldValues.forEach((node) => {
    node.textContent = String(state.gold);
  });
  diamondValues.forEach((node) => {
    node.textContent = String(state.diamonds);
  });
  updatePopulationDisplay();
}

function updatePopulationDisplay() {
  const nodes = document.querySelectorAll(".currency-pill.currency-population .currency-value");
  nodes.forEach((node) => {
    node.textContent = `${getPopulationUsed()}/${getMaxPopulation()}`;
  });
}

function updateJobQueueDisplay(now) {
  const container = document.querySelector(".military-job-list");
  if (!container) return;
  container.innerHTML = state.jobQueue.length
    ? state.jobQueue.map((job) => renderJobProgress(job, now)).join("")
    : `<p class="military-job-empty">No jobs in progress.</p>`;
}

function updateBuildingSlotsDisplay(now) {
  for (const buildingId of BUILDING_IDS) {
    const slot = document.querySelector(`[data-building-slot="${buildingId}"]`);
    if (!slot) continue;

    const job = getActiveBuildJob(buildingId);
    const progressBar = slot.querySelector(".castle-building-progress");
    if (!job || !progressBar) continue;

    const totalMs = job.completesAt - job.startedAt;
    const elapsedMs = totalMs - Math.max(0, job.completesAt - now);
    const progress = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 100;
    progressBar.style.width = `${progress}%`;
  }
}

function updateCastleHealthDisplay() {
  const maxHealth = getCastleMaxHealth();
  const percent = Math.max(0, Math.min(100, (state.castleHealth / maxHealth) * 100));
  const fill = document.querySelector(".castle-health-fill");
  const value = document.querySelector(".castle-health-value");
  if (fill) fill.style.width = `${percent}%`;
  if (value) value.textContent = `${Math.ceil(state.castleHealth)} / ${maxHealth}`;
}

function updateWaveHud() {
  const hud = document.querySelector(".wave-hud");
  if (!hud) return;

  const remainingMs = Math.max(0, combat.phaseEndsAt - performance.now());
  const remainingSec = Math.ceil(remainingMs / 1000);
  const phaseLabel = combat.phase === "attack" ? "Attack" : "Peace";
  const phaseClass = combat.phase === "attack" ? "wave-hud-attack" : "wave-hud-peace";
  const maxHealth = getCastleMaxHealth();
  const healthPercent = Math.max(0, Math.min(100, (state.castleHealth / maxHealth) * 100));
  const regen = getCastleRegenPerSecond();

  hud.className = `wave-hud ${phaseClass}`;
  hud.innerHTML = `
    <span class="wave-hud-title">Wave ${combat.waveNumber}</span>
    <span class="wave-hud-phase">${phaseLabel}: ${remainingSec}s</span>
    <span class="wave-hud-count">${combat.enemies.length} enemies · ${combat.troops.length} troops</span>
    <div class="castle-health-bar">
      <span class="castle-health-label">Castle HP</span>
      <div class="castle-health-track"><span class="castle-health-fill" style="width:${healthPercent}%"></span></div>
      <span class="castle-health-value">${Math.ceil(state.castleHealth)} / ${maxHealth}</span>
    </div>
    ${regen > 0 ? `<span class="wave-hud-regen">Regen: ${regen}/s</span>` : ""}
    ${state.castleHealth <= 0 ? `<span class="wave-hud-breach">Game Over</span>` : ""}
  `;
}

function syncCombatLayer() {
  combatLayer = document.querySelector(".combat-layer");
  if (!combatLayer) return;

  combatLayer.innerHTML = `
    ${combat.enemies.map((enemy) => renderEnemyUnit(enemy)).join("")}
    ${combat.troops.map((troop) => renderTroopUnit(troop)).join("")}
    ${combat.arrows.map((arrow) => `
      <span class="combat-arrow" style="left:${arrow.x}%;top:${arrow.y}%;"></span>
    `).join("")}
  `;
}

function combatLoop(now) {
  if (!combat.loopRunning) return;

  if (state.gameOver) {
    refreshCombatHud();
    combat.lastFrameTime = now;
    combat.loopFrame = requestAnimationFrame(combatLoop);
    return;
  }

  updateCombat(now);
  syncCombatLayer();
  updateWaveHud();
  combat.lastFrameTime = now;
  combat.loopFrame = requestAnimationFrame(combatLoop);
}

function startCombatLoop(resume = false) {
  if (combat.loopRunning) return;
  combat.loopRunning = true;
  if (!resume) {
    startWaveCycle(performance.now());
  }
  combat.lastFrameTime = 0;
  combat.loopFrame = requestAnimationFrame(combatLoop);
}

function stopCombatLoop() {
  combat.loopRunning = false;
  if (combat.loopFrame) {
    cancelAnimationFrame(combat.loopFrame);
    combat.loopFrame = 0;
  }
}

function resetCombatState() {
  combat.enemies = [];
  combat.arrows = [];
  combat.troops = [];
  combat.phase = "peace";
  combat.waveNumber = 1;
  combat.phaseEndsAt = 0;
  combat.lastSpawnAt = 0;
  combat.lastSpawnWallAt = 0;
  combat.peaceRegenUsed = 0;
  combat.nextEnemyId = 1;
  combat.nextArrowId = 1;
  combat.nextTroopId = 1;
  combat.lastFrameTime = 0;
  combat.towerAimAngles = {
    nw: TOWER_IDLE_ANGLES.nw,
    ne: TOWER_IDLE_ANGLES.ne,
    sw: TOWER_IDLE_ANGLES.sw,
    se: TOWER_IDLE_ANGLES.se
  };
  for (const towerId of TOWER_IDS) {
    combat.lastFireTimes[towerId] = 0;
  }
}

function resetCombatRuntime() {
  stopCombatLoop();
  resetCombatState();
}

function getDamageUpgradeCost(tower) {
  return 65 * tower.arrowDamageLevel;
}

function getDexUpgradeCost(tower) {
  return 55 * tower.dexLevel;
}

function enterCastle(username) {
  state.username = username;
  state.screen = "castle";
  state.shopOpen = false;
  state.selectedTower = "";
  state.castlePanelOpen = false;
  state.militaryPanelOpen = false;
  state.selectedBuilding = "";
  state.towerMessage = "";
  state.castleMessage = "";
  state.militaryMessage = "";
  state.buildingMessage = "";
  syncAccountProgress(username);
  state.error = "";
  state.success = "";
  render();
}

function renderCurrencyBar() {
  return `
    <div class="castle-currency">
      <div class="currency-pill currency-gold">
        <img class="currency-symbol currency-symbol-gold" src="gold-bar.svg" alt="">
        <span class="currency-value">${state.gold}</span>
      </div>
      <div class="currency-pill currency-diamond">
        <img class="currency-symbol currency-symbol-diamond" src="diamond.svg" alt="">
        <span class="currency-value">${state.diamonds}</span>
      </div>
      <div class="currency-pill currency-population" title="Population used / capacity">
        <span class="currency-symbol-pop">Pop</span>
        <span class="currency-value">${getPopulationUsed()}/${getMaxPopulation()}</span>
      </div>
    </div>
  `;
}

function renderCornerTowerButton(towerId) {
  const selectedClass = state.selectedTower === towerId ? " is-selected" : "";
  return `
    <button
      class="castle-corner-tower-btn${selectedClass}"
      type="button"
      data-action="open-tower"
      data-tower-id="${towerId}"
      aria-label="${TOWER_NAMES[towerId]}"
    >
      <span class="castle-corner-tower"></span>
      <span
        class="tower-crossbow tower-crossbow-${towerId}"
        style="--crossbow-aim:${combat.towerAimAngles[towerId]}deg"
        aria-hidden="true"
      ></span>
    </button>
  `;
}

function renderTowerUpgradePanel() {
  const tower = state.towers[state.selectedTower];
  if (!tower) return "";

  const towerMessage = state.towerMessage
    ? `<p class="message ${state.towerMessageType === "error" ? "error" : "success"}">${escapeHtml(state.towerMessage)}</p>`
    : `<p class="message"></p>`;
  const damageCost = getDamageUpgradeCost(tower);
  const dexCost = getDexUpgradeCost(tower);
  const fireRate = getTowerFireCooldownMs(tower.dex);

  return `
    <div class="tower-upgrade-panel">
      <p class="shop-kicker">Crossbow Tower</p>
      <h2>${TOWER_NAMES[state.selectedTower]}</h2>
      ${towerMessage}
      <div class="stat-grid">
        <div class="stat">
          <span>Arrow Damage</span>
          <strong>${tower.arrowDamage}</strong>
        </div>
        <div class="stat">
          <span>Dex / Fire Rate</span>
          <strong>${tower.dex}</strong>
        </div>
        <div class="stat">
          <span>Shot Cooldown</span>
          <strong>${fireRate}ms</strong>
        </div>
      </div>
      <div class="button-row vertical">
        <button class="button" type="button" data-action="upgrade-damage" data-tower-id="${state.selectedTower}">
          Upgrade Arrow Damage (${damageCost} gold)
        </button>
        <button class="button" type="button" data-action="upgrade-dex" data-tower-id="${state.selectedTower}">
          Upgrade Dex (${dexCost} gold)
        </button>
        <button class="button secondary" type="button" data-action="close-tower">Close</button>
      </div>
    </div>
  `;
}

function renderCastleUpgradePanel() {
  const castleMessage = state.castleMessage
    ? `<p class="message ${state.castleMessageType === "error" ? "error" : "success"}">${escapeHtml(state.castleMessage)}</p>`
    : `<p class="message"></p>`;
  const maxHealth = getCastleMaxHealth();
  const healthCost = getCastleHealthUpgradeCost();
  const regenCost = getCastleRegenUpgradeCost();
  const regen = getCastleRegenPerSecond();

  return `
    <div class="tower-upgrade-panel castle-upgrade-panel">
      <p class="shop-kicker">Main Keep</p>
      <h2>Castle Health</h2>
      ${castleMessage}
      <div class="stat-grid">
        <div class="stat">
          <span>Current HP</span>
          <strong>${Math.ceil(state.castleHealth)} / ${maxHealth}</strong>
        </div>
        <div class="stat">
          <span>Max Health Level</span>
          <strong>${state.castle.healthUpgradeLevel}</strong>
        </div>
        <div class="stat">
          <span>Health Regen</span>
          <strong>${regen}/s</strong>
        </div>
      </div>
      <div class="button-row vertical">
        <button class="button" type="button" data-action="upgrade-castle-health">
          Upgrade Max Health (${healthCost} gold)
        </button>
        <button class="button" type="button" data-action="upgrade-castle-regen">
          Upgrade Health Regen (${regenCost} diamonds)
        </button>
        <button class="button secondary" type="button" data-action="close-castle">Close</button>
      </div>
    </div>
  `;
}

function renderShopTrade(diamondCost, goldReward, tradeId) {
  return `
    <button class="shop-item shop-trade" type="button" data-action="buy-gold" data-trade-id="${tradeId}" data-diamond-cost="${diamondCost}" data-gold-reward="${goldReward}">
      <span class="shop-item-category">Exchange</span>
      <h3>${goldReward} Gold</h3>
      <div class="shop-trade-cost">
        <img class="currency-symbol currency-symbol-diamond" src="diamond.svg" alt="">
        <span>${diamondCost}</span>
      </div>
      <p>Trade diamonds for gold.</p>
    </button>
  `;
}

function setCampFeedback(message, type) {
  if (state.selectedBuilding) {
    state.buildingMessage = message;
    state.buildingMessageType = type;
  } else {
    state.militaryMessage = message;
    state.militaryMessageType = type;
  }
}

function renderCastleBuildingSlot(buildingId) {
  const def = BUILDING_DEFS[buildingId];
  const building = state.buildings[buildingId];
  const level = building.level;
  const activeJob = getActiveBuildJob(buildingId);
  const selectedClass = state.selectedBuilding === buildingId ? " is-selected" : "";
  const buildingClass = level > 0 ? ` castle-building-built castle-building-${buildingId}-lv-${level}` : " castle-building-empty";
  const buildingStateClass = activeJob ? " is-building" : "";
  const slotClass = BUILDING_SLOT_LAYOUT[buildingId];
  const label = level > 0 ? def.label : `+ ${def.label}`;
  const badge = level > 0 ? `<span class="castle-building-badge">Lv ${level}</span>` : "";
  const progress = activeJob
    ? `<span class="castle-building-progress-track"><span class="castle-building-progress" style="width:0%"></span></span>`
    : "";

  return `
    <button
      class="castle-building-slot ${slotClass}${buildingClass}${buildingStateClass}${selectedClass}"
      type="button"
      data-action="open-building"
      data-building-id="${buildingId}"
      data-building-slot="${buildingId}"
      aria-label="${def.label}"
    >
      <span class="castle-building-visual" aria-hidden="true"></span>
      <span class="castle-building-label">${label}</span>
      ${badge}
      ${progress}
    </button>
  `;
}

function renderBuildingPanel() {
  const buildingId = state.selectedBuilding;
  if (!buildingId) return "";

  const def = BUILDING_DEFS[buildingId];
  const building = state.buildings[buildingId];
  const level = building.level;
  const upgradeCost = getBuildingUpgradeCost(buildingId);
  const buildDuration = formatDuration(getBuildDurationMs(buildingId, level));
  const activeJob = getActiveBuildJob(buildingId);
  const buildingMessage = state.buildingMessage
    ? `<p class="message ${state.buildingMessageType === "error" ? "error" : "success"}">${escapeHtml(state.buildingMessage)}</p>`
    : `<p class="message"></p>`;
  const upgradeLabel = level === 0
    ? `Build (${upgradeCost} gold · ${buildDuration})`
    : level >= MAX_BUILDING_LEVEL
      ? "Max Level"
      : `Upgrade to Lv ${level + 1} (${upgradeCost} gold · ${buildDuration})`;
  const troops = Object.entries(TROOP_DEFS).filter(([, troopDef]) => troopDef.building === buildingId);
  const extraInfo = buildingId === "farm"
    ? `<p class="military-farm-pop">+${POPULATION_PER_FARM_LEVEL} population per level · cap ${getMaxPopulation()}</p>`
    : buildingId === "archery"
      ? `<p class="military-farm-pop">Upgrade with gold · +4 tower range per level · current range ${getTowerRange()}</p>`
      : "";
  const troopSection = troops.length && level > 0
    ? `<div class="military-troop-grid">${troops.map(([troopType, troopDef]) => renderTroopTrainCard(troopType, troopDef)).join("")}</div>`
    : "";

  return `
    <div class="tower-upgrade-panel building-upgrade-panel">
      <p class="shop-kicker">Castle Grounds</p>
      <h2>${def.label}</h2>
      <p class="military-building-desc">${def.desc}</p>
      <div class="stat-grid">
        <div class="stat">
          <span>Level</span>
          <strong>${level} / ${MAX_BUILDING_LEVEL}</strong>
        </div>
        <div class="stat">
          <span>Population</span>
          <strong>${getPopulationUsed()} / ${getMaxPopulation()}</strong>
        </div>
      </div>
      ${extraInfo}
      ${activeJob ? renderJobProgress(activeJob, performance.now()) : ""}
      ${buildingMessage}
      <div class="button-row vertical">
        <button class="button" type="button" data-action="upgrade-building" data-building-id="${buildingId}" ${level >= MAX_BUILDING_LEVEL || activeJob ? "disabled" : ""}>
          ${activeJob ? "Building..." : upgradeLabel}
        </button>
        ${troopSection}
        <button class="button secondary" type="button" data-action="close-building">Close</button>
      </div>
    </div>
  `;
}

function renderTroopTrainCard(troopType, troopDef) {
  const unlocked = isTroopUnlocked(troopType);
  const owned = state.army[troopType] || 0;
  const training = getActiveTrainJobsForBuilding(troopDef.building).some((job) => job.troopType === troopType);
  const trainDuration = formatDuration(getTrainDurationMs(troopType));
  const popCost = getTroopPopulationCost(troopType);
  const canAffordPop = getAvailablePopulation() >= popCost;
  const buildingBusy = hasActiveTrainJob(troopDef.building);

  return `
    <div class="military-troop-card ${unlocked ? "" : "is-locked"}">
      <div class="military-troop-top">
        <span class="military-troop-dot" style="background:${troopDef.color}"></span>
        <strong>${troopDef.label}</strong>
        <span class="military-troop-req">Lv ${troopDef.minLevel}</span>
      </div>
      <p>HP ${troopDef.health} · DMG ${troopDef.damage} · Pop ${popCost}</p>
      <p class="military-troop-owned">Ready: ${owned}${training ? " · training" : ""}</p>
      <button class="button secondary" type="button" data-action="train-troop" data-troop-type="${troopType}" ${unlocked && canAffordPop && !buildingBusy ? "" : "disabled"}>
        Train (${troopDef.cost} gold · ${trainDuration})
      </button>
    </div>
  `;
}

function renderMilitaryPanel() {
  const militaryMessage = state.militaryMessage
    ? `<p class="message ${state.militaryMessageType === "error" ? "error" : "success"}">${escapeHtml(state.militaryMessage)}</p>`
    : `<p class="message"></p>`;
  const now = performance.now();

  return `
    <div class="shop-interior military-interior">
      <p class="shop-kicker">War Camp</p>
      <h2>Train Army</h2>
      <div class="castle-currency castle-currency-shop">
        <div class="currency-pill currency-gold">
          <img class="currency-symbol currency-symbol-gold" src="gold-bar.svg" alt="">
          <span class="currency-value">${state.gold}</span>
        </div>
        <div class="currency-pill currency-diamond">
          <img class="currency-symbol currency-symbol-diamond" src="diamond.svg" alt="">
          <span class="currency-value">${state.diamonds}</span>
        </div>
        <div class="currency-pill currency-population">
          <span class="currency-symbol-pop">Pop</span>
          <span class="currency-value">${getPopulationUsed()}/${getMaxPopulation()}</span>
        </div>
      </div>
      <p class="military-army-summary">${getArmyCount()} troops ready · ${getAvailablePopulation()} population free · deployed each attack wave</p>
      ${militaryMessage}
      <div class="military-job-list">
        ${state.jobQueue.length
          ? state.jobQueue.map((job) => renderJobProgress(job, now)).join("")
          : `<p class="military-job-empty">No jobs in progress.</p>`}
      </div>
      <p class="military-army-hint">Click building plots inside the castle walls to build, upgrade, and train troops.</p>
      <div class="button-row">
        <button class="button secondary" type="button" data-action="close-military">Back to Castle</button>
      </div>
    </div>
  `;
}

function renderStudioIntro() {
  template(`
    <div class="studio-intro">
      <div class="snake-mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="studio-kicker">Loading game by</p>
      <h1 class="studio-name" aria-label="CyberSnakeStudios">
        <span>Cyber</span><span class="snake-letter">${pixelSnakeLetter("right")}</span><span>nake</span><span class="snake-letter">${pixelSnakeLetter("right")}</span><span>tudios</span>
      </h1>
      <div class="pixel-metal-snake" aria-hidden="true">
        <span class="snake-pixel tail"></span>
        <span class="snake-pixel body low"></span>
        <span class="snake-pixel body"></span>
        <span class="snake-pixel body high"></span>
        <span class="snake-pixel body"></span>
        <span class="snake-pixel body low"></span>
        <span class="snake-pixel body"></span>
        <span class="snake-pixel body high"></span>
        <span class="snake-pixel body"></span>
        <span class="snake-pixel body low"></span>
        <span class="snake-pixel body"></span>
        <span class="snake-pixel head"></span>
      </div>
      <p class="studio-status">Raising the drawbridge, arming the guards, and preparing the castle for battle...</p>
    </div>
  `, "center studio-screen");
}

function renderSignIn() {
  template(`
    <div class="stack">
      <h1 class="title">Sign In to Account</h1>
      <p class="subtitle">Return to your keep with the username and password you created together.</p>
      ${statusLine()}
    </div>
    <form class="form" data-form="sign-in">
      <label class="field">
        <span>Username</span>
        <input name="username" type="text" autocomplete="username" placeholder="Your knight name" required>
      </label>
      <label class="field">
        <span>Password</span>
        <input name="password" type="password" autocomplete="current-password" placeholder="Castle passphrase" required>
      </label>
      <div class="button-row vertical">
        <button class="button" type="submit">Sign In</button>
        <button class="button secondary" type="button" data-action="show-create-account">Create Account</button>
      </div>
    </form>
  `);
}

function renderCreateAccount() {
  template(`
    <div class="stack">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Choose the username and password you want for your castle. You will need both together to sign back in.</p>
      ${statusLine()}
    </div>
    <form class="form" data-form="create-account">
      <label class="field">
        <span>Username</span>
        <input name="username" type="text" autocomplete="username" placeholder="Pick a knight name" required>
      </label>
      <label class="field">
        <span>Password</span>
        <input name="password" type="password" autocomplete="new-password" placeholder="Pick a castle passphrase" required>
      </label>
      <div class="button-row vertical">
        <button class="button" type="submit">Create Account</button>
        <button class="button secondary" type="button" data-action="show-sign-in">Back to Sign In</button>
      </div>
    </form>
  `);
}

function renderCastle() {
  template(`
    <div class="castle-scene" aria-label="Your castle">
      <div class="castle-land">
        <div class="land-patch land-patch-a"></div>
        <div class="land-patch land-patch-b"></div>
        <div class="land-patch land-patch-c"></div>
        <div class="land-patch land-patch-d"></div>
        <div class="land-river"></div>
        ${Array.from({ length: 24 }, (_, index) => `<span class="land-tree land-tree-${index + 1}" aria-hidden="true"></span>`).join("")}
      </div>
      <div class="wave-hud wave-hud-peace"></div>
      <div class="combat-layer"></div>
      <div class="castle-compound">
        <div class="castle-corner castle-corner-nw">${renderCornerTowerButton("nw")}</div>
        <div class="castle-corner castle-corner-ne">${renderCornerTowerButton("ne")}</div>
        <div class="castle-corner castle-corner-sw">${renderCornerTowerButton("sw")}</div>
        <div class="castle-corner castle-corner-se">${renderCornerTowerButton("se")}</div>
        <div class="castle-wall castle-wall-n">
          <button class="castle-keep-btn" type="button" data-action="open-castle" aria-label="Main Keep">
            <div class="castle-keep">
              <div class="castle-keep-roof"></div>
              <div class="castle-keep-core"></div>
            </div>
          </button>
        </div>
        <div class="castle-wall castle-wall-e"></div>
        <div class="castle-wall castle-wall-w"></div>
        <div class="castle-wall castle-wall-s">
          <span class="castle-gate-opening"></span>
        </div>
        <div class="castle-courtyard">
          <div class="castle-courtyard-buildings">
            ${BUILDING_IDS.map((buildingId) => renderCastleBuildingSlot(buildingId)).join("")}
          </div>
        </div>
      </div>
      <button class="castle-shop" type="button" data-action="open-shop">Shop</button>
      <button class="castle-train" type="button" data-action="open-military">Train</button>
      ${renderCurrencyBar()}
      <button class="castle-close" type="button" data-action="show-sign-in" aria-label="Sign out">×</button>
      ${state.shopOpen ? renderShopPanel() : ""}
      ${state.militaryPanelOpen ? renderMilitaryPanel() : ""}
      ${state.selectedBuilding ? renderBuildingPanel() : ""}
      ${state.selectedTower ? renderTowerUpgradePanel() : ""}
      ${state.castlePanelOpen ? renderCastleUpgradePanel() : ""}
      ${state.gameOver ? `
        <div class="game-over-overlay">
          <div class="game-over-panel">
            <p class="shop-kicker">Defeat</p>
            <h2>Game Over</h2>
            <p>Your castle was destroyed. Gold, diamonds, buildings, troops, and upgrades have been reset.</p>
            <p class="game-over-start">Starting fresh at Wave 1 with 100 gold.</p>
            <button class="button" type="button" data-action="dismiss-game-over">Start Again</button>
          </div>
        </div>
      ` : ""}
    </div>
  `, "castle-screen");
}

function renderShopPanel() {
  const shopMessage = state.shopMessage
    ? `<p class="message ${state.shopMessageType === "error" ? "error" : "success"}">${escapeHtml(state.shopMessage)}</p>`
    : `<p class="message"></p>`;

  return `
    <div class="shop-interior">
      <p class="shop-kicker">Castle Market</p>
      <h2>Shop</h2>
      <div class="castle-currency castle-currency-shop">
        <div class="currency-pill currency-gold">
          <img class="currency-symbol currency-symbol-gold" src="gold-bar.svg" alt="">
          <span class="currency-value">${state.gold}</span>
        </div>
        <div class="currency-pill currency-diamond">
          <img class="currency-symbol currency-symbol-diamond" src="diamond.svg" alt="">
          <span class="currency-value">${state.diamonds}</span>
        </div>
      </div>
      ${shopMessage}
      <div class="shop-grid">
        ${renderShopTrade(15, 150, "gold-150")}
        ${renderShopTrade(30, 420, "gold-420")}
      </div>
      <div class="button-row">
        <button class="button secondary" type="button" data-action="close-shop">Back to Castle</button>
      </div>
    </div>
  `;
}

function statusLine() {
  if (state.error) return `<p class="message error">${state.error}</p>`;
  if (state.success) return `<p class="message success">${state.success}</p>`;
  return `<p class="message"></p>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pixelSnakeLetter(headSide = "right") {
  return Array.from({ length: 35 }, (_, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const isTop = row === 0;
    const isMiddle = row === 3;
    const isBottom = row === 6;
    const isLeftCurve = col === 0 && row > 0 && row < 3;
    const isRightCurve = col === 4 && row > 3 && row < 6;
    const isHead = row === 0 && ((headSide === "right" && col === 4) || (headSide === "left" && col === 0));
    const isMetal = isTop || isMiddle || isBottom || isLeftCurve || isRightCurve;
    return `<span class="snake-letter-pixel ${isMetal ? "metal" : ""} ${isHead ? `head head-${headSide}` : ""}"></span>`;
  }).join("");
}

function upgradeTowerStat(towerId, stat) {
  const tower = state.towers[towerId];
  if (!tower) return;

  const cost = stat === "damage" ? getDamageUpgradeCost(tower) : getDexUpgradeCost(tower);
  if (state.gold < cost) {
    state.towerMessage = `You need ${cost} gold for this upgrade.`;
    state.towerMessageType = "error";
    render();
    return;
  }

  state.gold -= cost;
  if (stat === "damage") {
    tower.arrowDamage += 1;
    tower.arrowDamageLevel += 1;
    state.towerMessage = "Arrow damage increased.";
  } else {
    tower.dex += 1;
    tower.dexLevel += 1;
    state.towerMessage = "Dex increased. Crossbow will fire faster in battle.";
  }

  state.towerMessageType = "success";
  saveAccountProgress(state.username);
  render();
}

function upgradeCastleHealth() {
  const cost = getCastleHealthUpgradeCost();
  if (state.gold < cost) {
    state.castleMessage = `You need ${cost} gold for this upgrade.`;
    state.castleMessageType = "error";
    render();
    return;
  }

  state.gold -= cost;
  state.castle.healthUpgradeLevel += 1;
  state.castleHealth = getCastleMaxHealth();
  state.castleMessage = `Max health increased to ${getCastleMaxHealth()} HP.`;
  state.castleMessageType = "success";
  saveAccountProgress(state.username);
  render();
}

function upgradeCastleRegen() {
  const cost = getCastleRegenUpgradeCost();
  if (state.diamonds < cost) {
    state.castleMessage = `You need ${cost} diamonds for this upgrade.`;
    state.castleMessageType = "error";
    render();
    return;
  }

  state.diamonds -= cost;
  state.castle.regenLevel += 1;
  state.castleMessage = `Health regen increased to ${getCastleRegenPerSecond()} HP/s during peace.`;
  state.castleMessageType = "success";
  saveAccountProgress(state.username);
  render();
}

function upgradeBuilding(buildingId) {
  const building = state.buildings[buildingId];
  const def = BUILDING_DEFS[buildingId];
  const cost = getBuildingUpgradeCost(buildingId);

  if (building.level >= MAX_BUILDING_LEVEL) {
    setCampFeedback(`${def.label} is fully upgraded.`, "error");
    render();
    return;
  }

  if (hasActiveBuildJob(buildingId)) {
    setCampFeedback(`${def.label} is already being built or upgraded.`, "error");
    render();
    return;
  }

  if (state.gold < cost) {
    setCampFeedback(`You need ${cost} gold for this ${building.level === 0 ? "build" : "upgrade"}.`, "error");
    render();
    return;
  }

  const now = performance.now();
  const targetLevel = building.level + 1;
  const durationMs = getBuildDurationMs(buildingId, building.level);

  state.gold -= cost;
  state.jobQueue.push({
    id: state.nextJobId++,
    kind: "build",
    buildingId,
    targetLevel,
    startedAt: now,
    completesAt: now + durationMs
  });

  setCampFeedback(`${def.label} ${building.level === 0 ? "construction" : "upgrade"} started. Ready in ${formatDuration(durationMs)}.`, "success");
  saveAccountProgress(state.username);
  render();
}

function trainTroop(troopType) {
  const def = TROOP_DEFS[troopType];
  const popCost = getTroopPopulationCost(troopType);

  if (!isTroopUnlocked(troopType)) {
    setCampFeedback(`Upgrade your ${BUILDING_DEFS[def.building].label} to level ${def.minLevel} first.`, "error");
    render();
    return;
  }

  if (hasActiveTrainJob(def.building)) {
    setCampFeedback(`${BUILDING_DEFS[def.building].label} is already training troops.`, "error");
    render();
    return;
  }

  if (getAvailablePopulation() < popCost) {
    setCampFeedback(`You need ${popCost} free population (build or upgrade your Farm).`, "error");
    render();
    return;
  }

  if (state.gold < def.cost) {
    setCampFeedback(`You need ${def.cost} gold to train a ${def.label}.`, "error");
    render();
    return;
  }

  const now = performance.now();
  const durationMs = getTrainDurationMs(troopType);

  state.gold -= def.cost;
  state.jobQueue.push({
    id: state.nextJobId++,
    kind: "train",
    troopType,
    population: popCost,
    startedAt: now,
    completesAt: now + durationMs
  });

  setCampFeedback(`Training ${def.label}. Ready in ${formatDuration(durationMs)}.`, "success");
  saveAccountProgress(state.username);
  render();
}

function closeCastlePanels() {
  state.shopOpen = false;
  state.militaryPanelOpen = false;
  state.selectedTower = "";
  state.selectedBuilding = "";
  state.castlePanelOpen = false;
}

app.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  if (actionTarget.dataset.action === "show-create-account") {
    state.screen = "create-account";
    state.error = "";
    state.success = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "show-sign-in") {
    if (state.username) saveAccountProgress(state.username);
    stopCombatLoop();
    state.screen = "sign-in";
    state.username = "";
    state.shopOpen = false;
    state.militaryPanelOpen = false;
    state.selectedBuilding = "";
    state.selectedTower = "";
    state.castlePanelOpen = false;
    state.towerMessage = "";
    state.castleMessage = "";
    state.militaryMessage = "";
    state.buildingMessage = "";
    state.error = "";
    state.success = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "open-shop") {
    closeCastlePanels();
    state.shopOpen = true;
    state.shopMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "dismiss-game-over") {
    dismissGameOver();
    return;
  }

  if (state.gameOver && actionTarget.dataset.action !== "show-sign-in") return;

  if (actionTarget.dataset.action === "open-military") {
    closeCastlePanels();
    state.militaryPanelOpen = true;
    state.militaryMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "close-military") {
    state.militaryPanelOpen = false;
    state.militaryMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "open-building") {
    closeCastlePanels();
    state.selectedBuilding = actionTarget.dataset.buildingId;
    state.buildingMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "close-building") {
    state.selectedBuilding = "";
    state.buildingMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "upgrade-building") {
    const buildingId = actionTarget.dataset.buildingId;
    if (!state.selectedBuilding) state.selectedBuilding = buildingId;
    upgradeBuilding(buildingId);
    return;
  }

  if (actionTarget.dataset.action === "train-troop") {
    const troopType = actionTarget.dataset.troopType;
    const buildingId = TROOP_DEFS[troopType]?.building;
    if (!state.selectedBuilding && buildingId) state.selectedBuilding = buildingId;
    trainTroop(troopType);
    return;
  }

  if (actionTarget.dataset.action === "open-tower") {
    closeCastlePanels();
    state.selectedTower = actionTarget.dataset.towerId;
    state.towerMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "open-castle") {
    closeCastlePanels();
    state.castlePanelOpen = true;
    state.castleMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "close-castle") {
    state.castlePanelOpen = false;
    state.castleMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "upgrade-castle-health") {
    upgradeCastleHealth();
    return;
  }

  if (actionTarget.dataset.action === "upgrade-castle-regen") {
    upgradeCastleRegen();
    return;
  }

  if (actionTarget.dataset.action === "close-tower") {
    state.selectedTower = "";
    state.towerMessage = "";
    render();
    return;
  }

  if (actionTarget.dataset.action === "upgrade-damage") {
    upgradeTowerStat(actionTarget.dataset.towerId, "damage");
    return;
  }

  if (actionTarget.dataset.action === "upgrade-dex") {
    upgradeTowerStat(actionTarget.dataset.towerId, "dex");
    return;
  }

  if (actionTarget.dataset.action === "buy-gold") {
    const diamondCost = Number(actionTarget.dataset.diamondCost);
    const goldReward = Number(actionTarget.dataset.goldReward);

    if (state.diamonds < diamondCost) {
      state.shopMessage = `You need ${diamondCost} diamonds for this trade.`;
      state.shopMessageType = "error";
      render();
      return;
    }

    state.diamonds -= diamondCost;
    state.gold += goldReward;
    saveAccountProgress(state.username);
    state.shopMessage = `Traded ${diamondCost} diamonds for ${goldReward} gold.`;
    state.shopMessageType = "success";
    render();
    return;
  }

  if (actionTarget.dataset.action === "close-shop") {
    state.shopOpen = false;
    state.shopMessage = "";
    render();
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const username = String(data.get("username") || "").trim();
  const password = String(data.get("password") || "").trim();

  state.error = "";
  state.success = "";

  if (!username || !password) {
    state.error = "Enter both a username and password.";
    render();
    return;
  }

  if (form.dataset.form === "create-account") {
    if (findAccount(username, password)) {
      enterCastle(username);
      return;
    }

    if (usernameTaken(username)) {
      state.error = "That username is already taken. Sign in with the password you created for it.";
      render();
      return;
    }

    if (passwordTaken(password)) {
      state.error = "That password is already used by another account. Pick a different one.";
      render();
      return;
    }

    const accounts = loadAccounts();
    accounts.push({
      username,
      password,
      gold: 100,
      diamonds: 0,
      towers: createDefaultTowers(),
      castle: createDefaultCastle(),
      buildings: createDefaultBuildings(),
      army: createDefaultArmy(),
      jobQueue: createDefaultJobQueue(),
      nextJobId: 1,
      combat: createDefaultCombatSave()
    });
    saveAccounts(accounts);
    enterCastle(username);
    return;
  }

  if (form.dataset.form === "sign-in") {
    if (!findAccount(username, password)) {
      state.error = "No account matches that username and password together.";
      render();
      return;
    }

    enterCastle(username);
  }
});

render();

setTimeout(() => {
  state.screen = "sign-in";
  render();
}, 3400);
