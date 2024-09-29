import type { User, Spot } from "@prisma/client";
import { error } from "console";

import { prisma } from "~/db.server";

export async function getSpotById(id: Spot["id"]) {
  return await prisma.spot.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createSpot(newSpot: Omit<Spot, "id">) {
  const dbResult = prisma.spot.create({
    data: newSpot,
  });
  try {
    const res = await dbResult;
    console.log("new spot inserted", res);
  } catch (error) {
    console.error(error);
    return;
  }
  return dbResult;
}

export async function getRecentSpots(length: number) {
  const dbResult = prisma.spot.findMany({
    take: length,
  });

  try {
    const res = await dbResult;
  } catch (error) {
    console.error(error);
    return;
  }
  return dbResult;
}

//naive implementation, has good potential to do a deep dive!!
export async function searchSpot(searchQuery: string) {
  const dbResult = await prisma.spot.findMany({
    where: {
      description: {
        search: searchQuery,
      },
    },
  });
  return dbResult;
}
