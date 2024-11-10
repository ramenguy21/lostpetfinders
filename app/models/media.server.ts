import { spots } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getSpotMedia(id: spots["id"]) {
  return await prisma.media.findMany({ where: { spotId: id } });
}
