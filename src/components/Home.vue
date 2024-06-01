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
        <v-text-field v-model="filter" clearable single-line append-inner-icon="mdi-magnify" label="Search Pokemon" width="100%"></v-text-field>
      </div>
    </div>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="1" class="list">
        <PokemonList :filter="filter"/>
      </v-tabs-window-item>

      <v-tabs-window-item value="2">
        Favourites
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script>

export default {
  data: () => ({
    tab: null,
    filter: '',
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
