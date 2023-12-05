import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function fetchMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const metricBodySchema = z.object({
    id_escola: z.string(),
  });

  const { id_escola } = metricBodySchema.parse(request.body);

  if (!id_escola) return reply.send("id_escola not provided!").status(400);

  try {
    const metrics = await prisma.metric.findMany({
      where: {
        id_escola,
      },
      orderBy: {
        ano: "desc",
      },
    });

    const formattedMetrics = metrics.reduce((acc, metric) => {
      const {
        ano,
        anos_escolares,
        ideb,
        taxa_aprovacao,
        indicador_rendimento,
        nota_saeb_lingua_portuguesa,
      } = metric;
      const formattedAnosEscolares = anos_escolares?.replace(/\s/g, ""); // Remover espaços

      if (!acc[formattedAnosEscolares]) {
        acc[formattedAnosEscolares] = {
          ideb: [],
          taxa_aprovacao: [],
          indicador_rendimento: [],
          nota_saeb_lingua_portuguesa: [],
        };
      }

      acc[formattedAnosEscolares].ideb.push({ ano, nota: ideb });
      acc[formattedAnosEscolares].taxa_aprovacao.push({
        ano,
        nota: taxa_aprovacao,
      });
      acc[formattedAnosEscolares].indicador_rendimento.push({
        ano,
        nota: indicador_rendimento,
      });
      acc[formattedAnosEscolares].nota_saeb_lingua_portuguesa.push({
        ano,
        nota: nota_saeb_lingua_portuguesa,
      });

      return acc;
    }, {});

    const formattedData = {};

    for (const anosEscolares in formattedMetrics) {
      const metricsByAnosEscolares = formattedMetrics[anosEscolares];
      for (const metricType in metricsByAnosEscolares) {
        if (!formattedData[metricType]) {
          formattedData[metricType] = {};
        }
        formattedData[metricType][anosEscolares] =
          metricsByAnosEscolares[metricType];
      }
    }

    return reply.send({ metrics: formattedData }).status(200);
  } catch (error) {
    return reply.send("Error while fetching metrics\n" + error).status(500);
  }
}
