document.addEventListener("DOMContentLoaded", () => {
  const preloaderContainer = document.getElementById("preloader");
  const progressBar = document.getElementById("progress-bar");
  const gameGridContainer = document.getElementById("game-grid-container");
  const nameInput = document.querySelector(`#form input`);
  const scoreElements = document.getElementsByClassName("score");
  const bestScoreElements = document.getElementsByClassName("bestScore");
  const timer = document.getElementById("timer");
  const hammer = document.getElementById("hammer");
  const playerNameField = document.getElementsByClassName("name");
  const pauseOverlay = document.getElementById("pauseOverlay");

  const form = document.getElementById("form");
  const intro = document.getElementById("intro");
  const game = document.getElementById("game");
  const end = document.getElementById("end");

  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");
  const resumeButton = document.getElementById("resumeButton");
  const tryAgainButton = document.getElementById("tryAgainButton");
  const formNextButton = document.getElementById("form-next");
  const introNextButton = document.getElementById("intro-next");

  let activeMoleIndex;
  let isAssetsLoaded = false;
  let moleInterval;
  let gameTimeout;
  let score = 0;
  let bestScore = 0;
  let activeMoleReference;
  let step = 0;
  let playerName;
  let isGameStarted = false;
  let remainingTime = GAME_DURATION;
  let timerInterval;
  let isPaused = false;

  const createGrid = () => {
    gameGridContainer.style = GRID_CONTAINER_STYLE;

    for (let i = 0; i < GRID_ITEM_COUNT; i++) {
      gameGridContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="grid-item" id="${getGridItemId(i)}">
                    <img src="./assets/diglet.png" alt="Mole" class="mole-img"/>
                </div>`
      );
    }
  };

  const getActiveMole = () => {
    return document.querySelector(`#${getGridItemId(activeMoleIndex)} img`);
  };

  const hideMole = () => {
    const selectedGridItem = getActiveMole();
    selectedGridItem.classList.remove("pop-up");
    selectedGridItem.classList.add("pop-down");
  };

  const showMole = () => {
    const selectedGridItem = getActiveMole();
    selectedGridItem.classList.remove("pop-down");
    selectedGridItem.classList.add("pop-up");
  };

  const resetMoleAnimations = () => {
    const moles = document.querySelectorAll(".grid-item img");
    for (let i = 0; i < moles.length; i++) {
      moles[i].classList.remove("pop-down");
      moles[i].classList.remove("pop-up");
    }
  };

  const getNewMolePositionIndex = () => {
    let newPosition = getRandomNumber(GRID_ITEM_COUNT);

    while (newPosition === activeMoleIndex) {
      newPosition = getRandomNumber(GRID_ITEM_COUNT);
    }

    return newPosition;
  };

  const changeMolePosition = () => {
    if (activeMoleIndex !== undefined) {
      hideMole();
    }

    activeMoleIndex = getNewMolePositionIndex();

    showMole();
  };

  const setBetScoreToUI = () => {
    for (let i = 0; i < bestScoreElements.length; i++) {
      bestScoreElements[i].textContent = bestScore;
    }
  };

  const setScoreToUI = () => {
    for (let i = 0; i < scoreElements.length; i++) {
      scoreElements[i].textContent = score;
    }
  };

  const setName = () => {
    for (let i = 0; i < playerNameField.length; i++) {
      playerNameField[i].textContent = playerName;
    }
  };

  const smashMole = () => {
    removeActiveMoleListener();
    hideMole(activeMoleIndex);
    score++;
    setScoreToUI();
    createActiveMole();
  };

  const removeActiveMoleListener = () => {
    if (!activeMoleReference) return;
    activeMoleReference.removeEventListener("click", smashMole);
  };

  const createActiveMoleListener = () => {
    activeMoleReference = document.querySelector(
      `#${getGridItemId(activeMoleIndex)}`
    );
    activeMoleReference.addEventListener("click", smashMole);
  };

  const createTimer = () => {
    const interval = setInterval(() => {
      remainingTime -= 1000;
      timer.textContent = remainingTime / 1000;
    }, 1000);

    return interval;
  };

  const createActiveMole = (instaRun = true) => {
    clearInterval(moleInterval);

    if (instaRun) {
      removeActiveMoleListener();
      changeMolePosition();
      createActiveMoleListener();
    }

    moleInterval = setInterval(() => {
      removeActiveMoleListener();
      changeMolePosition();
      createActiveMoleListener();
    }, 1000);
  };

  const startGame = () => {
    isGameStarted = true;
    score = 0;
    pauseButton.disabled = false;
    createActiveMole();
    timerInterval = createTimer();

    gameTimeout = setTimeout(() => {
      endGame();
      clearInterval(timerInterval);
    }, GAME_DURATION);

    startButton.disabled = true;
  };

  const endGame = () => {
    isGameStarted = false;
    pauseButton.disabled = true;
    clearInterval(moleInterval);
    clearTimeout(gameTimeout);
    hideMole(activeMoleIndex);
    startButton.disabled = false;
    goToStep(3);
    saveData(playerName, score);
    remainingTime = GAME_DURATION;
    timer.textContent = remainingTime / 1000;
    resetMoleAnimations();
  };

  const pauseGame = () => {
    isPaused = true;
    pauseButton.disabled = true;
    pauseOverlay.style.display = "flex";
    document.body.classList.add("paused");
    clearInterval(moleInterval);
    clearTimeout(gameTimeout);
    clearInterval(timerInterval);
  };

  const resumeGame = () => {
    isPaused = false;
    pauseButton.disabled = false;
    document.body.classList.remove("paused");
    pauseOverlay.style.display = "none";
    createActiveMole(false);

    timerInterval = createTimer(remainingTime);
    gameTimeout = setTimeout(() => {
      endGame();
      clearInterval(timerInterval);
    }, remainingTime);
  };

  const initialize = async () => {
    await preloadAssets(
      IMAGE_ASSETS,
      (progress) => {
        progressBar.style.width = `${progress * 100}%`;
      },
      () => {
        isAssetsLoaded = true;
      }
    );

    if (isAssetsLoaded) {
      preloaderContainer.style.display = "none";
      createGrid();
      goNext();
      timer.textContent = remainingTime / 1000;
    }
  };

  const saveData = (name, scoreProp) => {
    playerName = name;
    const scoreBoard = getArrayToLocalStorage(STORAGE_KEY) || [];
    const existingValue = scoreBoard.findIndex((value) => value.name === name);

    if (existingValue >= 0) {
      if (score) {
        scoreBoard[existingValue].score = scoreProp;
      }

      bestScore = scoreBoard[existingValue].score;
      return saveArrayToLocalStorage(scoreBoard, STORAGE_KEY);
    }

    const inputValue = {
      name,
      score: scoreProp,
    };

    return saveArrayToLocalStorage([...scoreBoard, inputValue], STORAGE_KEY);
  };

  const goToStep = (pageIndex) => {
    form.style.display = "none";
    intro.style.display = "none";
    game.style.display = "none";
    end.style.display = "none";

    switch (pageIndex) {
      case 0: {
        form.style.display = "flex";
        break;
      }
      case 1: {
        const isSaved = saveData(nameInput.value);
        if (!isSaved) return;

        setName();
        setBetScoreToUI();

        intro.style.display = "flex";
        break;
      }
      case 2: {
        game.style.display = "block";
        break;
      }
      case 3: {
        end.style.display = "flex";
        break;
      }
    }
  };

  const goNext = () => {
    goToStep(step);
    step++;
  };

  const tryAgain = () => {
    score = 0;
    setScoreToUI();
    goToStep(2);
  };

  const handleOrientationChange = () => {
    if (!isGameStarted) {
      return;
    }

    const orientation = screen.orientation.type;

    if (orientation.startsWith("landscape") && !isPaused) {
      pauseGame();
    } else if (orientation.startsWith("portrait") && isPaused) {
      resumeGame();
    }
  };

  screen.orientation.addEventListener("change", handleOrientationChange);
  formNextButton.addEventListener("click", goNext);
  introNextButton.addEventListener("click", goNext);
  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
  resumeButton.addEventListener("click", resumeGame);
  tryAgainButton.addEventListener("click", tryAgain);

  nameInput.addEventListener("input", (event) => {
    formNextButton.disabled = event.target.value.length === 0;
  });

  window.addEventListener("mousemove", (e) => {
    hammer.style.left = `${e.clientX - 30}px`;
    hammer.style.top = `${e.clientY - 30}px`;
  });

  window.addEventListener("click", () => {
    hammer.style.display = "block";
    hammer.style.transform = "rotate(-45deg)";

    if (isMobile()) {
      setTimeout(() => {
        hammer.style.display = "none";
      }, 300);
    }

    setTimeout(() => {
      hammer.style.transform = "rotate(0deg)";
    }, 100);
  });

  initialize();

  if (isMobile()) {
    hammer.style.display = "none";
  }
});
