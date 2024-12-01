import { spots } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getMedia(id: spots["id"]) {
  return await prisma.media.findMany({ where: { spotId: id } });
}
