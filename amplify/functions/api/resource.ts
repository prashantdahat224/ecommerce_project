// amplify/functions/api/resource.ts
import { defineFunction } from "@aws-amplify/backend";

/**
 * Single Lambda function for all 24 routes
 */
export const api = defineFunction({
  name: "api-function",      // Lambda name
  entry: "./handler.js",     // path to your main handler
  runtime: 18                // Node 18
});