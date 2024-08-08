const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalCachePruning: true,
    experimentalStyleIsolation: false,
    viewportWidth: 800,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      on('task', {
        clearCache() {
          return null
        }
      })
    }
  },
});
