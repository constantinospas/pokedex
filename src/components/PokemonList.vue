<template>
  <div v-if="loading" class="d-flex flex-wrap justify-center ga-10 ma-2 pa-2">
    <v-skeleton-loader width="300" height="500" v-for="_ in 20" type="card" :key="_"></v-skeleton-loader>
  </div>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-if="result && result" class="mt-2 mx-2 d-flex flex-wrap justify-center flex-1-1-100">
    <div v-for="pokemon in pokemons" :key="pokemon.id" class="d-flex my-2 mx-1 pa-0 justify-center transition">
      <PokemonCard :pokemon="pokemon"/>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['filter']);
console.log(props.filter);
import PokemonCard from './PokemonCard.vue';
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';

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
 }`;
const { result, loading, error } = useQuery(POKEMON_QUERY);
console.log(error);
const pokemons = computed(() => {
  if (result.value && result.value.pokemon_v2_pokemon && result.value.pokemon_v2_pokemon.length) {
    let simplified = result.value.pokemon_v2_pokemon;
    if (props.filter && props.filter.length) {
      simplified = result.value.pokemon_v2_pokemon.filter(pokemon => pokemon.name.includes(props.filter));
    }
    return simplified.map(pokemon => {
      return {
        'id': pokemon.id,
        'name': pokemon.name,
        'generation': pokemon.pokemon_v2_pokemonspecy.generation_id,
        'types': pokemon.pokemon_v2_pokemontypes.map(type => type.pokemon_v2_type.name),
        'image': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`
      };
    });
  }
});

</script>

<style scoped>
.transition {
  transition-duration: 500ms;
  animation-duration: 500ms;
}
</style>
