// Utilities
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useFavouriteStore = defineStore('favourites', {
  state: () => ({
    favourites: useLocalStorage('favourites', [])
  }),
  actions: {
    addPokemon(pokemon) {
      if (!this.favourites.find(p => p.id === pokemon.id)) {
        this.favourites.push(pokemon);
      }
    },
    removePokemon(pokemonId) {
      this.favourites = this.favourites.filter(p => p.id !== pokemonId);
    }
  },
  getters: {
    isFavourite: (state) => {
      return (pokemonId) => state.favourites.some(p => p.id === pokemonId);
    },
    sortedFavourites: (state) => {
      return [...state.favourites].sort((a, b) => {
        return a.id - b.id;
      });
    }
  }
});
