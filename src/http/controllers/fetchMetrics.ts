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
        ano: "asc",
      },
    });

    const school = await prisma.school.findMany({
      where: {
        id_escola,
      },
    });

    const data = {
      nome: school[0].nome,
      data: metrics,
    };

    return reply.send(data).status(200);
  } catch (error) {
    return reply.send("Error while fetching metrics\n" + error).status(500);
  }
}
