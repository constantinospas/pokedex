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
    <div class="d-flex align-center mt-6" style="height: 120px;flex-direction: column">
      <div class="d-flex" style="width: 20%;min-width: 210px">
        <v-text-field v-model="filter" single-line append-inner-icon="mdi-magnify" label="Search Pokemon" width="100%"></v-text-field>
      </div>
      <div class="d-flex text-capitalize ga-1">
        <v-chip :color="typeColors[idx]" v-for="(type,idx) in typeNames" :key="type" @click="filterByType(type)"
                :variant="selectedTypes.includes(type) ? 'flat' : 'outlined'">
          {{ type }}
        </v-chip>
      </div>
    </div>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1" class="list">
        <v-data-table-virtual
          :headers="headers"
          :items="pokemons"
          height="100%"
        >
          <template #[`item.image`]="{item}">
            <v-avatar :image="item.image"/>
          </template>
          <template #[`item.name`]="{item}">
            <p class="text-capitalize">{{ item.name }}</p>
          </template>
          <template #[`item.types`]="{item}">
            <p class="text-capitalize">{{ item.types.join(', ') }}</p>
          </template>
          <template #[`item.actions`]="{item}">
            <v-btn-group variant="plain" class="d-flex w-100 justify-center">
              <v-btn variant="plain" @click="view(item.id)">View</v-btn>
              <v-btn variant="plain" symbol="star" @click="handleFavourite(item)">
                Favourite
                <v-icon color="yellow" :icon="store.isFavourite(item.id) ? 'mdi-star' :'mdi-star-outline'" end/>
              </v-btn>
            </v-btn-group>
          </template>
        </v-data-table-virtual>
        <!--        <PokemonList :filter="filter?.toLowerCase()" :types="selectedTypes"/>-->
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
import { computed, ref } from 'vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router/auto';

export default {
  components: { PokemonCard },
  setup() {
    const store = useFavouriteStore()
    const typeNames = Object.keys(types)
    const typeColors = Object.values(types)
    const headers = [
      { title: 'ID', align: 'start', key: 'id' },
      { title: 'image', align: 'start', key: 'image' },
      { title: 'Name', align: 'start', key: 'name' },
      { title: 'Types', align: 'start', key: 'types' },
      { title: 'Generation', align: 'start', key: 'generation' },
      { title: 'Actions', align: 'center', key: 'actions' },
    ]
    const router = useRouter();
    const POKEMON_QUERY = gql`
  query Pokemon {
    pokemon_v2_pokemon  {
    name
    id
    pokemon_v2_pokemonspecy {
      generation_id
    }
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
  }
 }`
    const { result, loading, error } = useQuery(POKEMON_QUERY)
    const pokemons = computed(() => {
      if (result.value && result.value.pokemon_v2_pokemon && result.value.pokemon_v2_pokemon.length) {
        let simplified = result.value.pokemon_v2_pokemon
        if (filter.value && filter.value.length) {
          simplified = result.value.pokemon_v2_pokemon.filter(pokemon => pokemon.name.includes(filter.value))
        }
        if (selectedTypes.value && selectedTypes.value.length) {
          simplified = result.value.pokemon_v2_pokemon.filter(pokemon => {
            const pokemonTypes = pokemon.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name)
            return selectedTypes.value.every(filter => pokemonTypes.includes(filter))
          })
        }
        return simplified.map(pokemon => {
          return {
            'id': pokemon.id,
            'name': pokemon.name,
            'generation': pokemon.pokemon_v2_pokemonspecy.generation_id,
            'types': pokemon.pokemon_v2_pokemontypes.map(type => type.pokemon_v2_type.name),
            'image': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`,
          }
        })
      }
    })

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

    function handleFavourite(pokemon) {
      if (store.isFavourite(pokemon.id)) {
        store.removePokemon(pokemon.id)
      } else {
        store.addPokemon(pokemon)
      }
    }

    function view(id) {
      router.push(`/pokemon/${id}`)
    }

    return {
      store,
      filter,
      favs,
      typeNames,
      typeColors,
      selectedTypes,
      headers,
      pokemons,
      filterByType,
      handleFavourite,
      view,
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
}
</style>
