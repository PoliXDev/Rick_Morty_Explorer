import { 
    fetchCharacters, 
    fetchCharacterById,
    fetchEpisodes,
    fetchEpisodeById,
    extractCharacterIds,
    fetchCharactersByIds
} from "./api.js";
import {
    showLoader,
    hideLoader,
    showError,
    hideError,
    renderCharactersGrid,
    toggleLoadMoreButton,
    renderCharacterDetail,
    updateFavoriteIcon,
    renderEpisodesGrid,
    renderEpisodeCard,
    renderEpisodeDetail,
    showEpisodeCharactersSection,
    showCharactersLoader,
    hideCharactersLoader,
    renderEpisodeCharacters,
    updateFavoriteEpisodeIcon,
} from "./ui.js";
import {
    state,
    setNameFilter,
    setStatusFilter,
    setSpeciesFilter,
    setGenderFilter,
    incrementPage,
    setLoading,
    addCharacters,
    setInfo,
    hasNextPage,
    resetSearch,
} from "./state.js";
import {
    loadFavorites,
    saveFavorites,
    toggleFavorite,
    loadFavoriteEpisodes,
    saveFavoriteEpisodes,
    toggleFavoriteEpisode,
    getTotalFavoritesCount,
    debounce,
    getUrlParams,
} from "./utils.js";

const favoriteEpisodesState = {
    episodes: []
};

function initFavorites() {
    state.favorites = loadFavorites();
    favoriteEpisodesState.episodes = loadFavoriteEpisodes();
}

async function loadCharacters(append = false) {
    if (state.loading) return;
    
    try {
        setLoading(true);
        showLoader();
        hideError();
        
        const data = await fetchCharacters(state.page, {
            name: state.name,
            status: state.status,
            species: state.species,
            type: state.type,
            gender: state.gender,
        });
        
        if (append) {
            addCharacters(data.results);
        } else {
            state.characters = data.results;
        }
        
        setInfo(data.info);
        
        renderCharactersGrid(state.characters, state.favorites, false);
        toggleLoadMoreButton(hasNextPage());
        
    } catch (error) {
        showError("Error al cargar los personajes. Por favor, intenta de nuevo.");
    } finally {
        setLoading(false);
        hideLoader();
    }
}

function handleLoadMore() {
    if (!hasNextPage()) return;
    
    incrementPage();
    loadCharacters(true);
}

const handleSearchInput = debounce((event) => {
    setNameFilter(event.target.value.trim());
    loadCharacters(false);
}, 500);

function handleFilterChange(event) {
    const filterId = event.target.id;
    const value = event.target.value.trim();
    
    switch (filterId) {
        case "status-filter":
            setStatusFilter(value);
            break;
        case "species-filter":
            setSpeciesFilter(value);
            break;
        case "gender-filter":
            setGenderFilter(value);
            break;
    }
    
    loadCharacters(false);
}

function handleFavoriteClick(event) {
    event.stopPropagation();
    
    const button = event.target.closest(".favorite-btn");
    if (!button) return;
    
    const characterId = parseInt(button.dataset.id);
    state.favorites = toggleFavorite(characterId, state.favorites);
    saveFavorites(state.favorites);
    
    const isFav = state.favorites.includes(characterId);
    updateFavoriteIcon(characterId, isFav);
}

function handleCardClick(event) {
    const card = event.target.closest(".character-card");
    if (!card) return;
    
    const characterId = card.dataset.id;
    window.location.href = `./character-detail.html?id=${characterId}`;
}

function setupMainPageListeners() {
    const searchInput = document.getElementById("search-input");
    const statusFilter = document.getElementById("status-filter");
    const speciesFilter = document.getElementById("species-filter");
    const genderFilter = document.getElementById("gender-filter");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const grid = document.getElementById("characters-grid");
    
    if (searchInput) {
        searchInput.addEventListener("input", handleSearchInput);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener("change", handleFilterChange);
    }
    
    if (speciesFilter) {
        speciesFilter.addEventListener("input", debounce(handleFilterChange, 500));
    }
    
    if (genderFilter) {
        genderFilter.addEventListener("change", handleFilterChange);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", handleLoadMore);
    }
    
    if (grid) {
        grid.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-btn")) {
                handleFavoriteClick(event);
            } else {
                handleCardClick(event);
            }
        });
    }
}

async function loadCharacterDetail() {
    const params = getUrlParams();
    const characterId = params.get("id");
    
    if (!characterId) {
        showError("ID de personaje no válido");
        return;
    }
    
    try {
        showLoader();
        hideError();
        
        const character = await fetchCharacterById(characterId);
        renderCharacterDetail(character, state.favorites);
        
    } catch (error) {
        showError("Error al cargar el personaje. Por favor, intenta de nuevo.");
    } finally {
        hideLoader();
    }
}

function setupDetailPageListeners() {
    const detailContainer = document.getElementById("character-detail");
    
    if (detailContainer) {
        detailContainer.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-btn")) {
                handleFavoriteClick(event);
            }
        });
    }
}

const episodesState = {
    page: 1,
    name: "",
    episode: "",
    loading: false,
    episodes: [],
    info: null
};

async function loadEpisodes(append = false) {
    if (episodesState.loading) return;
    
    try {
        episodesState.loading = true;
        showLoader();
        hideError();
        
        const data = await fetchEpisodes(episodesState.page, {
            name: episodesState.name,
            episode: episodesState.episode,
        });
        
        if (append) {
            episodesState.episodes = [...episodesState.episodes, ...data.results];
        } else {
            episodesState.episodes = data.results;
        }
        
        episodesState.info = data.info;
        
        renderEpisodesGrid(episodesState.episodes, favoriteEpisodesState.episodes, false);
        toggleLoadMoreButton(episodesState.info && episodesState.info.next !== null);
        
    } catch (error) {
        showError("Error al cargar los episodios. Por favor, intenta de nuevo.");
    } finally {
        episodesState.loading = false;
        hideLoader();
    }
}

function handleEpisodesLoadMore() {
    if (!episodesState.info || !episodesState.info.next) return;
    
    episodesState.page++;
    loadEpisodes(true);
}

const handleEpisodeSearchInput = debounce((event) => {
    episodesState.name = event.target.value.trim();
    episodesState.page = 1;
    episodesState.episodes = [];
    loadEpisodes(false);
}, 500);

function handleSeasonFilter(event) {
    episodesState.episode = event.target.value;
    episodesState.page = 1;
    episodesState.episodes = [];
    loadEpisodes(false);
}

function handleFavoriteEpisodeClick(event) {
    event.stopPropagation();
    
    const button = event.target.closest(".favorite-episode-btn");
    if (!button) return;
    
    const episodeId = parseInt(button.dataset.episodeId);
    favoriteEpisodesState.episodes = toggleFavoriteEpisode(episodeId, favoriteEpisodesState.episodes);
    saveFavoriteEpisodes(favoriteEpisodesState.episodes);
    
    const isFav = favoriteEpisodesState.episodes.includes(episodeId);
    updateFavoriteEpisodeIcon(episodeId, isFav);
}

function handleEpisodeCardClick(event) {
    if (event.target.closest(".favorite-episode-btn")) {
        handleFavoriteEpisodeClick(event);
        return;
    }
    
    const card = event.target.closest(".episode-card");
    if (!card) return;
    
    const episodeId = card.dataset.id;
    window.location.href = `./episode.html?id=${episodeId}`;
}

function setupEpisodesPageListeners() {
    const searchInput = document.getElementById("episode-search-input");
    const seasonFilter = document.getElementById("season-filter");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const grid = document.getElementById("episodes-grid");
    
    if (searchInput) {
        searchInput.addEventListener("input", handleEpisodeSearchInput);
    }
    
    if (seasonFilter) {
        seasonFilter.addEventListener("change", handleSeasonFilter);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", handleEpisodesLoadMore);
    }
    
    if (grid) {
        grid.addEventListener("click", handleEpisodeCardClick);
    }
}

async function loadEpisodeDetail() {
    const params = getUrlParams();
    const episodeId = params.get("id");
    
    if (!episodeId) {
        showError("ID de episodio no válido");
        return;
    }
    
    try {
        showLoader();
        hideError();
        
        const episode = await fetchEpisodeById(episodeId);
        renderEpisodeDetail(episode, favoriteEpisodesState.episodes);
        await loadEpisodeCharacters(episode.characters);
        
    } catch (error) {
        showError("Error al cargar el episodio. Por favor, intenta de nuevo.");
    } finally {
        hideLoader();
    }
}

async function loadEpisodeCharacters(characterUrls) {
    if (!characterUrls || characterUrls.length === 0) {
        return;
    }
    
    try {
        showEpisodeCharactersSection();
        showCharactersLoader();
        
        const characterIds = extractCharacterIds(characterUrls);
        const characters = await fetchCharactersByIds(characterIds);
        
        renderEpisodeCharacters(characters, state.favorites);
        
    } catch (error) {
    } finally {
        hideCharactersLoader();
    }
}

function setupEpisodeDetailPageListeners() {
    const charactersGrid = document.getElementById("episode-characters-grid");
    const episodeDetail = document.getElementById("episode-detail");
    
    if (charactersGrid) {
        charactersGrid.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-btn")) {
                handleFavoriteClick(event);
            } else {
                handleCardClick(event);
            }
        });
    }
    
    if (episodeDetail) {
        episodeDetail.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-episode-btn")) {
                handleFavoriteEpisodeClick(event);
            }
        });
    }
}

function updateFavoritesStats() {
    const counts = getTotalFavoritesCount();
    
    const charactersCountEl = document.getElementById("characters-count");
    const episodesCountEl = document.getElementById("episodes-count");
    const totalCountEl = document.getElementById("total-count");
    
    if (charactersCountEl) charactersCountEl.textContent = counts.characters;
    if (episodesCountEl) episodesCountEl.textContent = counts.episodes;
    if (totalCountEl) totalCountEl.textContent = counts.total;
}

function toggleEmptyState(show) {
    const emptyState = document.getElementById("empty-state");
    if (emptyState) {
        if (show) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
        }
    }
}

function switchFavoritesTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    const charactersTab = document.getElementById("characters-tab-content");
    const episodesTab = document.getElementById("episodes-tab-content");
    
    if (tabName === "characters") {
        charactersTab?.classList.remove("hidden");
        charactersTab?.classList.add("active");
        episodesTab?.classList.add("hidden");
        episodesTab?.classList.remove("active");
    } else {
        episodesTab?.classList.remove("hidden");
        episodesTab?.classList.add("active");
        charactersTab?.classList.add("hidden");
        charactersTab?.classList.remove("active");
    }
}

async function loadFavoriteCharacters() {
    const favoriteIds = state.favorites;
    
    if (favoriteIds.length === 0) {
        const grid = document.getElementById("favorite-characters-grid");
        if (grid) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">💫</div>
                    <p class="no-results-text">No tienes personajes favoritos</p>
                    <a href="./characters.html" class="empty-btn" style="margin-top: 1rem;">Explorar Personajes</a>
                </div>
            `;
        }
        return;
    }
    
    try {
        showLoader();
        const characters = await fetchCharactersByIds(favoriteIds);
        const grid = document.getElementById("favorite-characters-grid");
        
        if (grid && characters.length > 0) {
            const html = characters.map((char) => 
                `<article class="character-card" data-id="${char.id}">
                    <img src="${char.image}" alt="${char.name}" class="character-card-image">
                    <div class="character-card-content">
                        <div class="character-card-header">
                            <h2 class="character-card-name">${char.name}</h2>
                            <button class="favorite-btn is-favorite" data-id="${char.id}" aria-label="Quitar de favoritos">★</button>
                        </div>
                        <div class="character-card-info">
                            <div class="character-card-row">
                                <span class="status-badge">
                                    <span class="status-dot ${char.status.toLowerCase()}"></span>
                                    <span class="character-card-value">${char.status}</span>
                                </span>
                            </div>
                            <div class="character-card-row">
                                <span class="character-card-label">Especie:</span>
                                <span class="character-card-value">${char.species}</span>
                            </div>
                            <div class="character-card-row">
                                <span class="character-card-label">Género:</span>
                                <span class="character-card-value">${char.gender}</span>
                            </div>
                        </div>
                    </div>
                </article>`
            ).join("");
            grid.innerHTML = html;
        }
    } catch (error) {
        showError("Error al cargar personajes favoritos");
    } finally {
        hideLoader();
    }
}

async function loadFavoriteEpisodesList() {
    const favoriteIds = favoriteEpisodesState.episodes;
    
    if (favoriteIds.length === 0) {
        const grid = document.getElementById("favorite-episodes-grid");
        if (grid) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">💫</div>
                    <p class="no-results-text">No tienes episodios favoritos</p>
                    <a href="./episodes.html" class="empty-btn" style="margin-top: 1rem;">Explorar Episodios</a>
                </div>
            `;
        }
        return;
    }
    
    try {
        showLoader();
        
        const episodesPromises = favoriteIds.map(id => fetchEpisodeById(id));
        const episodes = await Promise.all(episodesPromises);
        
        const grid = document.getElementById("favorite-episodes-grid");
        if (grid && episodes.length > 0) {
            const html = episodes.map((episode) => 
                renderEpisodeCard(episode, favoriteEpisodesState.episodes)
            ).join("");
            grid.innerHTML = html;
        }
    } catch (error) {
        showError("Error al cargar episodios favoritos");
    } finally {
        hideLoader();
    }
}

function setupFavoritesPageListeners() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            switchFavoritesTab(btn.dataset.tab);
        });
    });
    
    const charactersGrid = document.getElementById("favorite-characters-grid");
    const episodesGrid = document.getElementById("favorite-episodes-grid");
    
    if (charactersGrid) {
        charactersGrid.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-btn")) {
                handleFavoriteClick(event);
                setTimeout(() => {
                    loadFavoriteCharacters();
                    updateFavoritesStats();
                }, 300);
            } else {
                handleCardClick(event);
            }
        });
    }
    
    if (episodesGrid) {
        episodesGrid.addEventListener("click", (event) => {
            if (event.target.closest(".favorite-episode-btn")) {
                handleFavoriteEpisodeClick(event);
                setTimeout(() => {
                    loadFavoriteEpisodesList();
                    updateFavoritesStats();
                }, 300);
            } else {
                handleEpisodeCardClick(event);
            }
        });
    }
}

async function initFavoritesPage() {
    updateFavoritesStats();
    
    const counts = getTotalFavoritesCount();
    
    if (counts.total === 0) {
        toggleEmptyState(true);
    } else {
        toggleEmptyState(false);
        await loadFavoriteCharacters();
        await loadFavoriteEpisodesList();
    }
    
    setupFavoritesPageListeners();
}

function init() {
    initFavorites();
    
    const isCharacterDetailPage = document.getElementById("character-detail") !== null;
    const isEpisodesPage = document.getElementById("episodes-grid") !== null;
    const isEpisodeDetailPage = document.getElementById("episode-detail") !== null;
    const isFavoritesPage = document.getElementById("favorite-characters-grid") !== null;
    const isCharactersPage = document.getElementById("characters-grid") !== null && 
                             document.getElementById("search-input") !== null;
    
    if (isFavoritesPage) {
        initFavoritesPage();
    } else if (isCharacterDetailPage) {
        setupDetailPageListeners();
        loadCharacterDetail();
    } else if (isEpisodesPage) {
        setupEpisodesPageListeners();
        loadEpisodes(false);
    } else if (isEpisodeDetailPage) {
        setupEpisodeDetailPageListeners();
        loadEpisodeDetail();
    } else if (isCharactersPage) {
        setupMainPageListeners();
        loadCharacters(false);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
