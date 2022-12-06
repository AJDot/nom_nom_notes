import { defineConfig } from "cypress"
import { config as dotenvConfig } from "dotenv"

dotenvConfig({ path: "./.env.test" })

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_VUE_APP_URL || "http://localhost:5174",
    supportFile: "cypress/support/index.ts",
    videoUploadOnPasses: false,
    env: {
      api_url: process.env.VITE_VUE_APP_API_URL,
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
})
