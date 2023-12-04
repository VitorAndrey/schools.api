import { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "@/lib/prisma";

export async function fetchSchools(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const schools = await prisma.school.findMany();

    return reply.send(schools).status(200);
  } catch (error) {
    return reply.send("Error while fetching schools\n" + error).status(500);
  }
}
