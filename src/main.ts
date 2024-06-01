// Plugins
import { registerPlugins } from './plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

registerPlugins(app)

app.mount('#app')
