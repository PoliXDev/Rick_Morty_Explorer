const BASE_URL = "https://rickandmortyapi.com/api";

function buildUrl(endpoint, filters = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    Object.keys(filters).forEach((key) => {
        if (filters[key]) {
            url.searchParams.append(key, filters[key]);
        }
    });
    
    return url.toString();
}

export async function fetchCharacters(page = 1, filters = {}) {
    try {
        const url = buildUrl("/character", {
            page,
            name: filters.name,
            status: filters.status,
            species: filters.species,
            type: filters.type,
            gender: filters.gender,
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                return { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchCharacterById(id) {
    try {
        const response = await fetch(`${BASE_URL}/character/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchCharactersByIds(ids) {
    try {
        if (!ids || ids.length === 0) {
            return [];
        }
        
        const idsString = ids.join(",");
        const response = await fetch(`${BASE_URL}/character/${idsString}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        throw error;
    }
}

export async function fetchEpisodes(page = 1, filters = {}) {
    try {
        const url = buildUrl("/episode", {
            page,
            name: filters.name,
            episode: filters.episode,
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                return { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchEpisodeById(id) {
    try {
        const response = await fetch(`${BASE_URL}/episode/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export function extractCharacterIds(characterUrls) {
    return characterUrls.map((url) => {
        const parts = url.split("/");
        return parseInt(parts[parts.length - 1]);
    });
}
