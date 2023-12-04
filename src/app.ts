import fastify from "fastify";
import { appRoutes } from "./http/routes";
import cors from "@fastify/cors";

export const app = fastify();

(async () => {
  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
})();

app.register(appRoutes);
