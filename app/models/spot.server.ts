import type { spots } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getSpotById(id: spots["id"]) {
  return await prisma.spots.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createSpot(
  newSpot: Omit<spots, "id">,
  imgUrls: string[],
) {
  const db = prisma.$transaction(async (prisma) => {
    //create the spot
    const createdSpot = await prisma.spots.create({
      data: newSpot,
    });

    //insert corresponding files in the media table
    if (imgUrls && imgUrls.length > 0) {
      const mediaInserts = imgUrls.map((imgUrl) =>
        prisma.media.create({ data: { url: imgUrl, spotId: createdSpot.id } }),
      );
      await Promise.all(mediaInserts);
    }
    return createdSpot;
  });

  try {
    const res = await db;
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function getRecentSpots(length: number) {
  const dbResult = prisma.spots.findMany({
    take: length,
  });

  try {
    await dbResult;
  } catch (error) {
    console.error(error);
    return;
  }
  return dbResult;
}

//naive implementation, has good potential to do a deep dive!!
export async function searchSpot(searchQuery: string) {
  const dbResult = await prisma.spots.findMany({
    where: {
      description: {
        search: searchQuery,
      },
    },
  });
  return dbResult;
}
