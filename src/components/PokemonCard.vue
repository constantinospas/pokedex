<template>
  <v-lazy
    :min-height="200"
    :options="{'threshold':0.8}"
    transition="scroll-y-transition"
  >
    <v-card class="pokemon-card" elevation="6">
      <v-card-title class="text-capitalize" style="max-width: 230px;">#{{ pokemon.id }} {{ pokemon.name }}</v-card-title>
      <v-card-subtitle class="text-capitalize">{{ pokemon.types.join(', ') }}</v-card-subtitle>
      <v-card-text>
        <v-img :draggable="false" style="user-select: none;" :src="pokemon.image" width="200" height="100"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-btn-group variant="flat" class="d-flex w-100 justify-center">
          <v-btn @click="view(pokemon.id)">View</v-btn>
          <v-btn symbol="star" @click="handleFavourite(pokemon)">
            Favourite
            <v-icon color="yellow" :icon="store.isFavourite(pokemon.id) ? 'mdi-star' :'mdi-star-outline'" end/>
          </v-btn>
        </v-btn-group>
      </v-card-actions>
    </v-card>
  </v-lazy>

</template>

<script setup lang="ts">
import { useFavouriteStore } from '../stores/favourites';
import { useRouter } from 'vue-router/auto';

const router = useRouter();
const store = useFavouriteStore();
defineProps(['pokemon']);

function handleFavourite(pokemon) {
  if (store.isFavourite(pokemon.id)) {
    store.removePokemon(pokemon.id);
  } else {
    store.addPokemon(pokemon);
  }
}

function view(id: number) {
  router.push(`/pokemon/${id}`);
}
</script>

<style scoped>
</style>
