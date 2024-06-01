<template>
  <v-container class="container pa-16">
    <RouterLink to="/">
      <v-btn prepend-icon="mdi-arrow-left">Back</v-btn>
    </RouterLink>
    <div v-if="loading" class="d-flex flex-wrap justify-center ga-10 ma-2 pa-2">
      <v-skeleton-loader width="75%" height="100%" type="card-avatar"></v-skeleton-loader>
    </div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="result && result" class="mt-2 mx-2 d-flex flex-wrap justify-center">
      <v-row>
        <v-col>
          <div class="d-flex mb-12">
            <v-img :src="pokemon.image" height="200" width="200"></v-img>
          </div>
          <v-card>
            <v-card-text class="mt-4">
              <v-slider
                v-model="pokemon.stats.hp"
                thumb-label
                label="HP"
                thumb-color="red"
                readonly
              ></v-slider>
              <v-slider
                v-model="pokemon.stats.attack"
                thumb-label
                label="Attack"
                thumb-color="blue"
                readonly
              ></v-slider>

              <v-slider
                v-model="pokemon.stats.defense"
                thumb-label
                label="Defense"
                thumb-color="green"
                readonly
              ></v-slider>

              <v-slider
                v-model="pokemon.stats['special-attack']"
                thumb-label
                label="Sp. Attack"
                thumb-color="cyan"
                readonly
              ></v-slider>

              <v-slider
                v-model="pokemon.stats['special-defense']"
                thumb-label
                label="Sp. Defense"
                thumb-color="lime"
                readonly
              ></v-slider>

              <v-slider
                v-model="pokemon.stats.speed"
                thumb-label
                label="Speed"
                thumb-color="white"
                readonly
              ></v-slider>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-container class="mt-12">{{ pokemon.flavor_text }}</v-container>
          <v-card></v-card>
          <v-container class="text-capitalize d-flex ga-2">
            <v-chip :color="typeColors[type]" variant="flat" v-for="type in pokemon.types" :key="type">
              {{ type }}
            </v-chip>
          </v-container>
          <v-container>
            <v-btn @click="playCry" icon="mdi-volume-high"></v-btn>
          </v-container>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useRoute } from 'vue-router/auto';

const route = useRoute();
console.log(route.params.id);

const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};

const POKEMON_QUERY = gql`
query getPokemon {
  pokemon_v2_pokemon(where: {id: {_eq: ${route.params.id}}}) {
    id
    name
    types: pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    sprites: pokemon_v2_pokemonsprites {
      sprites
    }
    evolution_chain: pokemon_v2_pokemonspecy {
      evolution_chain: pokemon_v2_evolutionchain {
        species: pokemon_v2_pokemonspecies {
          id
          name
        }
      }
      flavor_texts: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1, order_by: {version_id: desc}) {
        flavor_text
      }
    }
    cries: pokemon_v2_pokemoncries {
      cries
    }
    stats: pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
  }
}`;
const { result, loading, error } = useQuery(POKEMON_QUERY);
console.log(result);
const pokemon = computed(() => {
  return result.value.pokemon_v2_pokemon.map(pokemon => {
    // Extract types
    const types = pokemon.types.map(type => type.pokemon_v2_type.name);

    // Extract evolution chain
    const evolutionChain = pokemon.evolution_chain.evolution_chain.species.map(species => ({
      id: species.id,
      name: species.name
    }));

    // Extract flavor text
    const flavorText = pokemon.evolution_chain.flavor_texts[0]?.flavor_text || '';
    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats.reduce((acc, stat) => {
        const statName = stat.pokemon_v2_stat.name;
        const baseStat = stat.base_stat;
        acc[statName] = baseStat;
        return acc;
      }, {}),
      types,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`,
      evolution_chain: evolutionChain,
      flavor_text: flavorText,
      cry: pokemon.cries[0].cries.latest
    };
  })[0];
});

function playCry() {
  const audio = new Audio(pokemon.value.cry);
  audio.volume = 0.2;
  audio.play();
}


</script>

<style scoped>
:root {
  background: red;
}

.container {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  overflow-x: hidden;
}
</style>
