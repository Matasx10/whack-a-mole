const GRID_SIZE = 3;
const GRID_ITEM_COUNT = GRID_SIZE * GRID_SIZE;
const GAME_DURATION = 20 * 1000;
const IMAGE_ASSETS = [
  "./assets/diglet.png",
  "./assets/hammer.png",
  "./assets/hit.png",
];
const STORAGE_KEY = "scoreboard";
const GRID_CONTAINER_STYLE = `grid-template-columns: repeat(${GRID_SIZE}, 1fr);`;
