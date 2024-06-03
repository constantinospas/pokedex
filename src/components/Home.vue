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
    <div class="d-flex align-center mt-6 vertical-scroll" style="height: 120px;flex-direction: column">
      <div class="d-flex" style="width: 20%;min-width: 210px">
        <v-text-field v-model="filter" single-line append-inner-icon="mdi-magnify" label="Search Pokemon" width="100%"></v-text-field>
      </div>
      <div class="d-flex text-capitalize ga-1 overflow-x-auto overflow-y-hidden" style="width: 100vw;">
        <v-chip :color="typeColors[idx]" v-for="(type,idx) in typeNames" :key="type" @click="filterByType(type)"
                :variant="selectedTypes.includes(type) ? 'flat' : 'outlined'" style="min-width: max-content">
          {{ type }}
        </v-chip>
      </div>
    </div>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1" class="list">
        <PokemonList :filter="filter?.toLowerCase()" :types="selectedTypes"/>
      </v-tabs-window-item>
      <v-tabs-window-item value="2" class="list">
        <div class="mt-2 mx-2 d-flex flex-wrap justify-center flex-1-1-100" v-if="favs.length">
          <div v-for="pokemon in favs"
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
import { types } from '../variables/types'
import { ref } from 'vue'

export default {
  components: { PokemonCard },
  setup() {
    const store = useFavouriteStore()
    const typeNames = Object.keys(types)
    const typeColors = Object.values(types)
    const favs = computed(() => {
      const filtered = store.sortedFavourites.filter(sortedPoke => sortedPoke.name.includes(filter.value.toLowerCase()))
      console.log(filtered)
      if (selectedTypes.value && selectedTypes.value.length) {
        return filtered.filter(fav => {
          return selectedTypes.value.every(filter => fav.types.includes(filter))
        })
      } else {
        return filtered
      }
    })
    let filter = ref('')
    let selectedTypes = ref([])

    function filterByType(type) {
      if (selectedTypes.value.includes(type)) {
        const idx = selectedTypes.value.findIndex(t => t === type)
        selectedTypes.value.splice(idx, 1)
      } else {
        selectedTypes.value.push(type)
      }
    }

    return {
      store,
      filter,
      favs,
      typeNames,
      typeColors,
      selectedTypes,
      filterByType,
    }
  },
  data: () => ({
    tab: null,
  }),
}
</script>

<style scoped>
.container {
  height: 100dvh;
  overflow: hidden;

  .list {
    height: calc(100dvh - 84px - 120px - 12px);
    overflow: auto;
  }

  .vertical-scroll {
    ::-webkit-scrollbar {
      height: 2px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
}
</style>
