import { lost_pets } from "@prisma/client";
import { prisma } from "~/db.server";

export const createLostPet = async (
  newLostPet: Omit<lost_pets, "id">,
  imgUrls: string[],
) => {
  const db = prisma.$transaction(async (prisma) => {
    const createdPet = await prisma.lost_pets.create({ data: newLostPet });

    //insert corresponding files in the media table
    if (imgUrls && imgUrls.length > 0) {
      const mediaInserts = imgUrls.map((imgUrl) =>
        prisma.media.create({ data: { url: imgUrl, spotId: createdPet.id } }),
      );
      await Promise.all(mediaInserts);
    }
    return createdPet;
  });

  try {
    const res = await db;
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getPetById = async (id: string) => {
  return await prisma.lost_pets.findFirst({ where: { id } });
};
