export const state = {
    page: 1,
    name: "",
    status: "",
    species: "",
    type: "",
    gender: "",
    loading: false,
    characters: [],
    favorites: [],
    info: null
};

export function resetSearch() {
    state.page = 1;
    state.characters = [];
    state.info = null;
}

export function setNameFilter(name) {
    state.name = name;
    resetSearch();
}

export function setStatusFilter(status) {
    state.status = status;
    resetSearch();
}

export function setSpeciesFilter(species) {
    state.species = species;
    resetSearch();
}

export function setTypeFilter(type) {
    state.type = type;
    resetSearch();
}

export function setGenderFilter(gender) {
    state.gender = gender;
    resetSearch();
}

export function incrementPage() {
    state.page++;
}

export function setLoading(loading) {
    state.loading = loading;
}

export function addCharacters(characters) {
    state.characters = [...state.characters, ...characters];
}

export function setInfo(info) {
    state.info = info;
}

export function hasNextPage() {
    return state.info && state.info.next !== null;
}
