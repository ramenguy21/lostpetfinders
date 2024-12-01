import { prisma } from "~/db.server";

export async function getAllBreeds() {
  return await prisma.breeds.findMany({
    select: { id: true, name: true, taxonomy: true },
  });
}

export async function getBreedData(breedId: string) {
  return await prisma.breeds.findFirst({ where: { id: breedId } });
}

export async function getBreedsByTaxonomy(taxonomy: string) {
  return await prisma.breeds.findMany({
    where: {
      taxonomy,
    },
  });
}
