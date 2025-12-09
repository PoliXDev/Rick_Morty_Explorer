import { translateStatus, translateGender, isFavorite } from "./utils.js";

export function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.remove("hidden");
    }
}

export function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("hidden");
    }
}

export function showError(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
    }
}

export function hideError() {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.classList.add("hidden");
    }
}

export function renderCharacterCard(character, favorites) {
    const isFav = isFavorite(character.id, favorites);
    
    return `
        <article class="character-card" data-id="${character.id}">
            <img 
                src="${character.image}" 
                alt="${character.name}"
                class="character-card-image"
            >
            <div class="character-card-content">
                <div class="character-card-header">
                    <h2 class="character-card-name">${character.name}</h2>
                    <button 
                        class="favorite-btn ${isFav ? "is-favorite" : ""}" 
                        data-id="${character.id}"
                        aria-label="Añadir a favoritos"
                    >
                        ${isFav ? "★" : "☆"}
                    </button>
                </div>
                <div class="character-card-info">
                    <div class="character-card-row">
                        <span class="status-badge">
                            <span class="status-dot ${character.status.toLowerCase()}"></span>
                            <span class="character-card-value">${translateStatus(character.status)}</span>
                        </span>
                    </div>
                    <div class="character-card-row">
                        <span class="character-card-label">Especie:</span>
                        <span class="character-card-value">${character.species}</span>
                    </div>
                    <div class="character-card-row">
                        <span class="character-card-label">Género:</span>
                        <span class="character-card-value">${translateGender(character.gender)}</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

export function renderCharactersGrid(characters, favorites, append = false) {
    const grid = document.getElementById("characters-grid");
    if (!grid) return;
    
    if (characters.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <p class="no-results-text">No se encontraron personajes</p>
            </div>
        `;
        return;
    }
    
    const html = characters.map((character) => 
        renderCharacterCard(character, favorites)
    ).join("");
    
    if (append) {
        grid.innerHTML += html;
    } else {
        grid.innerHTML = html;
    }
}

export function toggleLoadMoreButton(show) {
    const button = document.getElementById("load-more-btn");
    if (button) {
        if (show) {
            button.classList.remove("hidden");
        } else {
            button.classList.add("hidden");
        }
    }
}

export function renderCharacterDetail(character, favorites) {
    const detailContainer = document.getElementById("character-detail");
    if (!detailContainer) return;
    
    const isFav = isFavorite(character.id, favorites);
    
    const html = `
        <div class="character-detail-header">
            <img 
                src="${character.image}" 
                alt="${character.name}"
                class="character-detail-image"
            >
        </div>
        <div class="character-detail-content">
            <div class="character-detail-title">
                <h1>${character.name}</h1>
                <button 
                    class="favorite-btn ${isFav ? "is-favorite" : ""}" 
                    data-id="${character.id}"
                    aria-label="Añadir a favoritos"
                    style="font-size: 2rem;"
                >
                    ${isFav ? "★" : "☆"}
                </button>
            </div>
            
            <div class="character-detail-grid">
                <div class="character-detail-item">
                    <span class="character-detail-label">Estado</span>
                    <div class="status-badge">
                        <span class="status-dot ${character.status.toLowerCase()}"></span>
                        <span class="character-detail-value">${translateStatus(character.status)}</span>
                    </div>
                </div>
                
                <div class="character-detail-item">
                    <span class="character-detail-label">Especie</span>
                    <span class="character-detail-value">${character.species}</span>
                </div>
                
                <div class="character-detail-item">
                    <span class="character-detail-label">Tipo</span>
                    <span class="character-detail-value">${character.type || "N/A"}</span>
                </div>
                
                <div class="character-detail-item">
                    <span class="character-detail-label">Género</span>
                    <span class="character-detail-value">${translateGender(character.gender)}</span>
                </div>
                
                <div class="character-detail-item">
                    <span class="character-detail-label">Origen</span>
                    <span class="character-detail-value">${character.origin.name}</span>
                </div>
                
                <div class="character-detail-item">
                    <span class="character-detail-label">Ubicación</span>
                    <span class="character-detail-value">${character.location.name}</span>
                </div>
            </div>
        </div>
    `;
    
    detailContainer.innerHTML = html;
}

export function updateFavoriteIcon(characterId, isFav) {
    const buttons = document.querySelectorAll(`.favorite-btn[data-id="${characterId}"]`);
    buttons.forEach((button) => {
        button.textContent = isFav ? "★" : "☆";
        if (isFav) {
            button.classList.add("is-favorite");
        } else {
            button.classList.remove("is-favorite");
        }
    });
}

function formatEpisodeCode(code) {
    const match = code.match(/S(\d+)E(\d+)/);
    if (match) {
        return `Temporada ${parseInt(match[1])}, Episodio ${parseInt(match[2])}`;
    }
    return code;
}

function formatAirDate(date) {
    if (!date) return "Fecha desconocida";
    
    const months = {
        January: "Enero", February: "Febrero", March: "Marzo",
        April: "Abril", May: "Mayo", June: "Junio",
        July: "Julio", August: "Agosto", September: "Septiembre",
        October: "Octubre", November: "Noviembre", December: "Diciembre"
    };
    
    const parts = date.split(" ");
    if (parts.length === 3) {
        const month = months[parts[0]] || parts[0];
        return `${parts[1]} de ${month} de ${parts[2]}`;
    }
    
    return date;
}

export function renderEpisodeCard(episode, favoriteEpisodes = []) {
    const isFavEpisode = favoriteEpisodes.includes(episode.id);
    
    return `
        <article class="episode-card" data-id="${episode.id}">
            <div class="episode-card-header">
                <div class="episode-badge">${episode.episode}</div>
                <div class="episode-card-info">
                    <h3 class="episode-card-title">${episode.name}</h3>
                    <p class="episode-card-subtitle">${formatEpisodeCode(episode.episode)}</p>
                </div>
                <button 
                    class="favorite-episode-btn ${isFavEpisode ? "is-favorite" : ""}" 
                    data-episode-id="${episode.id}"
                    aria-label="Añadir episodio a favoritos"
                >
                    ${isFavEpisode ? "★" : "☆"}
                </button>
            </div>
            <div class="episode-card-content">
                <div class="episode-card-row">
                    <span class="episode-card-label">📅 Fecha de emisión:</span>
                    <span class="episode-card-value">${formatAirDate(episode.air_date)}</span>
                </div>
                <div class="episode-card-row">
                    <span class="episode-card-label">👥 Personajes:</span>
                    <span class="episode-card-value">${episode.characters.length}</span>
                </div>
            </div>
            <div class="episode-card-footer">
                <button class="episode-view-btn">Ver detalle →</button>
            </div>
        </article>
    `;
}

export function renderEpisodesGrid(episodes, favoriteEpisodes = [], append = false) {
    const grid = document.getElementById("episodes-grid");
    if (!grid) return;
    
    if (episodes.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <p class="no-results-text">No se encontraron episodios</p>
            </div>
        `;
        return;
    }
    
    const html = episodes.map((episode) => renderEpisodeCard(episode, favoriteEpisodes)).join("");
    
    if (append) {
        grid.innerHTML += html;
    } else {
        grid.innerHTML = html;
    }
}

export function renderEpisodeDetail(episode, favoriteEpisodes = []) {
    const detailContainer = document.getElementById("episode-detail");
    if (!detailContainer) return;
    
    const isFavEpisode = favoriteEpisodes.includes(episode.id);
    
    const html = `
        <div class="episode-detail-card">
            <div class="episode-detail-header">
                <div class="episode-badge-large">${episode.episode}</div>
                <div class="episode-detail-title-section">
                    <h1 class="episode-detail-title">${episode.name}</h1>
                    <p class="episode-detail-subtitle">${formatEpisodeCode(episode.episode)}</p>
                </div>
                <button 
                    class="favorite-episode-btn ${isFavEpisode ? "is-favorite" : ""}" 
                    data-episode-id="${episode.id}"
                    aria-label="Añadir episodio a favoritos"
                    style="font-size: 2rem;"
                >
                    ${isFavEpisode ? "★" : "☆"}
                </button>
            </div>
            
            <div class="episode-detail-content">
                <div class="episode-detail-grid">
                    <div class="episode-detail-item">
                        <span class="episode-detail-label">Código del Episodio</span>
                        <span class="episode-detail-value">${episode.episode}</span>
                    </div>
                    
                    <div class="episode-detail-item">
                        <span class="episode-detail-label">Fecha de Emisión</span>
                        <span class="episode-detail-value">${formatAirDate(episode.air_date)}</span>
                    </div>
                    
                    <div class="episode-detail-item">
                        <span class="episode-detail-label">Personajes</span>
                        <span class="episode-detail-value">${episode.characters.length} personajes</span>
                    </div>
                    
                    <div class="episode-detail-item">
                        <span class="episode-detail-label">Temporada</span>
                        <span class="episode-detail-value">Temporada ${episode.episode.match(/S(\d+)/)[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    detailContainer.innerHTML = html;
}

export function showEpisodeCharactersSection() {
    const section = document.getElementById("episode-characters-section");
    if (section) {
        section.classList.remove("hidden");
    }
}

export function showCharactersLoader() {
    const loader = document.getElementById("characters-loader");
    if (loader) {
        loader.classList.remove("hidden");
    }
}

export function hideCharactersLoader() {
    const loader = document.getElementById("characters-loader");
    if (loader) {
        loader.classList.add("hidden");
    }
}

export function renderEpisodeCharacters(characters, favorites) {
    const grid = document.getElementById("episode-characters-grid");
    if (!grid) return;
    
    const html = characters.map((character) => 
        renderCharacterCard(character, favorites)
    ).join("");
    
    grid.innerHTML = html;
}

export function updateFavoriteEpisodeIcon(episodeId, isFav) {
    const buttons = document.querySelectorAll(`.favorite-episode-btn[data-episode-id="${episodeId}"]`);
    buttons.forEach((button) => {
        button.textContent = isFav ? "★" : "☆";
        if (isFav) {
            button.classList.add("is-favorite");
        } else {
            button.classList.remove("is-favorite");
        }
    });
}
