import { defineFunction } from "@aws-amplify/backend";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export const api = defineFunction((scope) => {
  return new NodejsFunction(scope, "api-function", {
    entry: "amplify/functions/api/handler.js",
    handler: "handler",
    runtime: Runtime.NODEJS_20_X,
    environment: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL!,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY!,
    },
  });
});