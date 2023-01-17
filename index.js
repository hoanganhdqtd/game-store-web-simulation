const bar = document.querySelector(".fa-bars");
const menuButton = document.querySelector(".nav-menu");
let loading = false;

bar.addEventListener("click", () => {
  menuButton.classList.toggle("show-menu");
});

const API_ENDPOINT =
  "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";

// let GENRES;
const GENRES = [
  "action",
  "free to play",
  "strategy",
  "adventure",
  "indie",
  "rpg",
  "animation & modeling",
  "video production",
  "casual",
  "simulation",
  "racing",
  "violent",
  "massively multiplayer",
  "nudity",
  "sports",
  "early access",
  "gore",
  "utilities",
  "design & illustration",
  "web publishing",
  "education",
  "software training",
  "sexual content",
  "audio production",
  "game development",
  "photo editing",
  "accounting",
  "documentary",
  "tutorial",
];

const gameList = document.querySelector("#game-list");
const searchInput = document.querySelector("#search-input");
const searchIcon = document.querySelector("#search-icon");
const gameDetailContainer = document.querySelector("#game-detail-container");

const loadSomeGames = async () => {
  try {
    loading = true;
    gameList.innerHTML = '<div class="loader"></div>';
    const response = await fetch(`${API_ENDPOINT}games`);
    const data = await response.json();
    // console.log(data);
    loading = false;
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayGames = async () => {
  try {
    const games = await loadSomeGames();
    // console.log(games);

    gameList.innerHTML = "";
    gameDetailContainer.innerHTML = "";
    games.data.forEach((game) => {
      // console.log(game);
      const newElement = document.createElement("div");
      newElement.className = "game-card-container";
      newElement.innerHTML = `
      <div class="game-card" onclick="displayGameDetail(${game.appid})">
        <img src="${game.header_image}" alt="${game.name}" class="" />
        <span class="game-name">${game.name} 
        </span>
        <span class="game-price">$${game.price}</span>
        <div class="game-genres">${game.genres.join(", ")}</div>
      </div>`;
      gameList.appendChild(newElement);
    });
  } catch (error) {
    console.log(error);
  }
};

const getGameDetail = async (appId) => {
  try {
    let url = `${API_ENDPOINT}single-game/${appId}`;
    const response = await fetch(url);
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayGameDetail = async (appId) => {
  try {
    loading = true;
    gameList.innerHTML = '<div class="loader"></div>';
    const appData = await getGameDetail(appId);
    // console.log(appData.data.appid);
    gameList.innerHTML = "";
    gameDetailContainer.innerHTML = "";
    loading = false;
    const newElement = document.createElement("div");
    newElement.className = "game-card-container";

    newElement.innerHTML = `
      <div class="game-detail" onclick="getGameDetail(${appData.data.appid})">
        <img src="${appData.data.header_image}" alt="${
      appData.data.name
    }" class="game-image" />
        <span class="game-name">${appData.data.name}</span>
        <span class="game-price">$${appData.data.price}</span>
        <div class="game-genres">${appData.data.genres.join(", ")}</div>
        <div class="game-description">${appData.data.description}</div>
        <div class="game-ratings">
          <span class="positive">${
            appData.data.positive_ratings
          } positive ratings</span>
          <span class="negative">${
            appData.data.negative_ratings
          } negative ratings</span>
        </div>
      </div>`;
    // gameList.appendChild(newElement);
    gameDetailContainer.appendChild(newElement);
  } catch (error) {
    console.log(error);
  }
};

const getGamesByGenre = async (genre) => {
  try {
    let url = `${API_ENDPOINT}games?genres=${genre}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const displayGamesOfGenre = async (genre) => {
  try {
    loading = true;
    gameList.innerHTML = '<div class="loader"></div>';
    const data = await getGamesByGenre(genre);
    // console.log(data);
    loading = false;
    gameList.innerHTML = "";
    gameDetailContainer.innerHTML = "";
    data.data.forEach((game) => {
      // console.log(game);
      const newElement = document.createElement("div");
      newElement.className = "game-card-container";
      newElement.innerHTML = `
      <div class="game-card" onclick="displayGameDetail(${game.appid})">
        <img src="${game.header_image}" alt="${game.name}" class="" />
        <span class="game-name">${game.name} 
        </span>
        <span class="game-price">$${game.price}</span>
        <div class="game-genres">${game.genres.join(", ")}</div>
      </div>`;
      gameList.appendChild(newElement);
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllGenres = async () => {
  try {
    let limit = 30;
    let url = `${API_ENDPOINT}genres?limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    let result = [];
    data.data.forEach((genre) => {
      result.push(genre.name);
    });
    // console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getGamesByInput = async (input) => {
  let newInput = input.trim().toLowerCase();
  console.log(GENRES.includes(newInput));
  if (GENRES.includes(newInput)) {
    const result = getGamesByGenre(newInput);
    // console.log(result);
    return result;
  }
  try {
    let url = `${API_ENDPOINT}games?q=${newInput}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

displayGames();

searchIcon.addEventListener("click", async () => {
  const inputValue = searchInput.value;
  // console.log(inputValue);
  loading = true;
  gameList.innerHTML = '<div class="loader"></div>';
  const searchResult = await getGamesByInput(inputValue);
  // console.log(searchResult);
  loading = false;

  if (searchResult) {
    gameList.innerHTML = "";
    gameDetailContainer.innerHTML = "";
    searchResult.data.forEach((game) => {
      // console.log(game);
      const newElement = document.createElement("div");
      newElement.className = "game-card-container";
      newElement.innerHTML = `
      <div class="game-card" onclick="displayGameDetail(${game.appid})">
        <img src="${game.header_image}" alt="${game.name}" class="" />
        <span class="game-name">${game.name} 
        </span>
        <span class="game-price">$${game.price}</span>
        <div class="game-genres">${game.genres.join(", ")}</div>
      </div>`;
      gameList.appendChild(newElement);
    });
  }
});
