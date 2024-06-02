<template>
  <div class="container">
    <v-tabs
      v-model="tab"
      align-tabs="center"
      bg-color="deep-purple-accent-4"
      stacked
    >
      <v-tab value="1">
        <v-icon icon="mdi-account-box"></v-icon>
        Search
      </v-tab>

      <v-tab value="2">
        <v-icon icon="mdi-heart"></v-icon>
        Favorites
      </v-tab>
    </v-tabs>
    <div class="d-flex justify-center mt-6 mb-n3" style="height: 78px;">
      <div class="d-flex" style="width: 20%;min-width: 210px">
        <v-text-field v-model="filter" single-line append-inner-icon="mdi-magnify" label="Search Pokemon" width="100%"></v-text-field>
      </div>
    </div>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1" class="list">
        <PokemonList :filter="filter?.toLowerCase()"/>
      </v-tabs-window-item>

      <v-tabs-window-item value="2" class="list">
        <div class="mt-2 mx-2 d-flex flex-wrap justify-center flex-1-1-100"
             v-if="store.sortedFavourites.filter(sortedPoke => sortedPoke.name.includes(filter?.toLowerCase())).length">
          <div v-for="pokemon in store.sortedFavourites.filter(sortedPoke => sortedPoke.name.includes(filter?.toLowerCase()))"
               :key="pokemon.id" class="d-flex my-2 mx-1 pa-0 justify-center transition">
            <PokemonCard :pokemon="pokemon"/>
          </div>
        </div>
        <div v-else class="v-container d-flex justify-center text-h6">
          No data
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script>
import { useFavouriteStore } from '../stores/favourites'
import PokemonCard from './PokemonCard.vue'

export default {
  components: { PokemonCard },
  setup() {
    const store = useFavouriteStore()
    return {
      store,
    }
  },
  data: () => ({
    tab: null,
    filter: ''
  }),
}
</script>

<style scoped>
.container {
  height: 100dvh;
  overflow: hidden;

  .list {
    height: calc(100dvh - 72px - 78px - 12px);
    overflow: auto;
  }
}
</style>
