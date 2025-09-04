async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function preloadAssets(assetUrls, onProgress, onComplete) {
  let loadedCount = 0;
  const total = assetUrls.length;

  const loadImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        onProgress(loadedCount / total);
        resolve(img);
      };
      img.onerror = () => {
        loadedCount++;
        onProgress(loadedCount / total);
        console.warn("ERROR loading asset:", url);
        resolve(null);
      };
      img.src = url;
    });

  for (const url of assetUrls) {
    await loadImage(url);
    await sleep(300);
  }

  // load all in paralell
  // const loadedAssets = await Promise.all(assetUrls.map(loadImage));

  onComplete(); // filter out failed ones
}

const getGridItemId = (number) => `grid-item-${number}`;

const getRandomNumber = (range) => Math.floor(Math.random() * range);

const saveArrayToLocalStorage = (array, key) => {
  try {
    localStorage.setItem(key, JSON.stringify(array));
    return true;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return false;
  }
};

const getArrayToLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
