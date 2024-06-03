<template>
  <v-container class="container pa-lg-16" :key="pokemonId">
    <RouterLink to="/">
      <v-btn prepend-icon="mdi-arrow-left">Back</v-btn>
    </RouterLink>
    <div v-if="loading" class="d-flex flex-wrap justify-center ga-10 ma-2 pa-2">
      <v-skeleton-loader width="75%" height="100%" type="card-avatar"></v-skeleton-loader>
    </div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="result && !loading" class="mt-2 mx-2 d-flex flex-wrap justify-center">
      <v-row style="width: 100dvw;">
        <v-col>
          <div class="d-flex mb-12">
            <v-img :src="pokemon.image" height="200" width="200"></v-img>
          </div>
          <v-card>
            <v-card-text class="mt-4">
              <v-slider
                v-model="pokemon.stats.hp"
                thumb-color="red"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats.hp"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="HP" style="width: 120px;" class="d-flex justify-center"/>
                </template>
              </v-slider>
              <v-slider
                v-model="pokemon.stats.attack"
                thumb-color="blue"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats.attack"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="Attack" style="width: 120px;" class="d-flex justify-center"/>
                </template>

              </v-slider>

              <v-slider
                v-model="pokemon.stats.defense"
                thumb-color="green"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats.defense"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="Defense" style="width: 120px;" class="d-flex justify-center"/>
                </template>

              </v-slider>

              <v-slider
                v-model="pokemon.stats['special-attack']"
                thumb-color="cyan"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats['special-attack']"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="Special Attack" style="width: 120px;" class="d-flex justify-center"/>
                </template>

              </v-slider>

              <v-slider
                v-model="pokemon.stats['special-defense']"
                thumb-color="lime"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats['special-defense']"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="Special Defense" style="width: 120px;" class="d-flex justify-center"/>
                </template>

              </v-slider>

              <v-slider
                v-model="pokemon.stats.speed"
                thumb-color="white"
                readonly
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="pokemon.stats.speed"
                    density="compact"
                    style="width: 60px"
                    variant="outlined"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <template v-slot:label>
                  <v-label text="Speed" style="width: 120px;" class="d-flex justify-center"/>
                </template>

              </v-slider>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-container class="mt-12 text-capitalize">
            <h1>#{{ pokemon.id }} {{ pokemon.name }}</h1>
          </v-container>
          <v-container>{{ pokemon.flavor_text }}</v-container>
          <v-card></v-card>
          <v-container class="text-capitalize d-flex ga-2">
            <v-chip :color="typeColors[type]" variant="flat" v-for="type in pokemon.types" :key="type">
              {{ type }}
            </v-chip>
          </v-container>
          <v-container>
            <v-btn-group rounded>
              <v-btn  @click="playCry(false)" prepend-icon="mdi-volume-high" rounded>New</v-btn>
              <v-btn  @click="playCry(true)" prepend-icon="mdi-volume-high">Old</v-btn>
            </v-btn-group>
          </v-container>
          <v-container v-if="pokemon.evolution_chain.length > 1" class="d-flex flex-column">
            <v-btn-group class="d-flex flex-wrap flex-1-1-100 ga-2">
              <v-btn v-for="evolution in pokemon.evolution_chain" :key="evolution" @click="updateId(evolution.id)">
                <v-img width="50" height="50" class="mr-4"
                       :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${evolution.id}.svg`"/>
                {{ evolution.name }}
              </v-btn>
            </v-btn-group>
          </v-container>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router/auto';
import { types } from '../../variables/types';

const route = useRoute();
const pokemonId = ref(route.params.id);

watch(pokemonId, async (nv, ov) => {
  await refetch({ id: nv });
});

function updateId(newId) {
  pokemonId.value = newId;
}

const typeColors = types;
const POKEMON_QUERY = gql`
query getPokemon ($id: Int!) {
  pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
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

let { result, loading, error, refetch } = useQuery(POKEMON_QUERY, { id: pokemonId.value });

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
      cry: pokemon.cries[0].cries.latest,
      cry_legacy: pokemon.cries[0].cries.legacy
    };
  })[0];
});

function playCry(legacy) {
  const audio = new Audio(legacy ? pokemon.value.cry_legacy : pokemon.value.cry);
  audio.volume = 0.2;
  audio.play();
}

</script>

<style scoped>
:root {
  background: red;
}

.container {
  height: 100dvh;
  width: 100dvw;
  overflow: auto;
  overflow-x: hidden;
}
</style>
