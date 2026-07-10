import { defineConfig } from "cypress";
import "dotenv/config"

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.LOCALHOST_URL,
  },
});