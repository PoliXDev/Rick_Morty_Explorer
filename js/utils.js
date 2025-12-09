const FAVORITES_KEY = "rick-morty-favorites";
const FAVORITES_EPISODES_KEY = "rick-morty-favorites-episodes";

export function loadFavorites() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        return [];
    }
}

export function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
    }
}

export function isFavorite(id, favorites) {
    return favorites.includes(id);
}

export function toggleFavorite(id, favorites) {
    if (isFavorite(id, favorites)) {
        return favorites.filter((favId) => favId !== id);
    } else {
        return [...favorites, id];
    }
}

export function loadFavoriteEpisodes() {
    try {
        const favorites = localStorage.getItem(FAVORITES_EPISODES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        return [];
    }
}

export function saveFavoriteEpisodes(favorites) {
    try {
        localStorage.setItem(FAVORITES_EPISODES_KEY, JSON.stringify(favorites));
    } catch (error) {
    }
}

export function isFavoriteEpisode(id, favorites) {
    return favorites.includes(id);
}

export function toggleFavoriteEpisode(id, favorites) {
    if (isFavoriteEpisode(id, favorites)) {
        return favorites.filter((favId) => favId !== id);
    } else {
        return [...favorites, id];
    }
}

export function getTotalFavoritesCount() {
    const characters = loadFavorites().length;
    const episodes = loadFavoriteEpisodes().length;
    return { characters, episodes, total: characters + episodes };
}

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

export function translateStatus(status) {
    const translations = {
        alive: "Vivo",
        dead: "Muerto",
        unknown: "Desconocido",
    };
    return translations[status.toLowerCase()] || status;
}

export function translateGender(gender) {
    const translations = {
        male: "Masculino",
        female: "Femenino",
        genderless: "Sin género",
        unknown: "Desconocido",
    };
    return translations[gender.toLowerCase()] || gender;
}
