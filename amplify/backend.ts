// amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { api } from "./functions/api/resource";

/**
 * Define the backend
 */
defineBackend({
  functions: api,   // single Lambda
});