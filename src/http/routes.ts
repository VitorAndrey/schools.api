import axios from "axios";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.get("/teste", async (req, res) => {
    const response = await axios.get(
      "http://educacao.dadosabertosbr.org/api/escola/26124297"
    );

    return res.send(response.data);
  });
}
