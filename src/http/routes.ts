import { FastifyInstance } from "fastify";

import { fetchSchools } from "./controllers/fetchSchools";
import { fetchMetrics } from "./controllers/fetchMetrics";

export async function appRoutes(app: FastifyInstance) {
  app.get("/schools", fetchSchools);

  app.post("/metrics", fetchMetrics);
}
