-- CreateEnum
CREATE TYPE "TailType" AS ENUM ('STRAIGHT', 'CURLY', 'BOBBED', 'FEATHERED', 'PLUME', 'BUSHY', 'SHORT', 'LONG', 'DOCKED');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('BLACK', 'WHITE', 'BROWN', 'GOLDEN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spots" (
    "id" TEXT NOT NULL,
    "spotterId" TEXT NOT NULL,
    "lostPetId" TEXT,
    "breedId" TEXT,
    "taxonomy" TEXT NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "colors" "Color"[],
    "coatType" TEXT,
    "age" INTEGER,
    "tailType" "TailType",
    "mark" TEXT,
    "description" TEXT,
    "claimed" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lost_pets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breedId" TEXT,
    "mark" TEXT,
    "description" TEXT,
    "address" TEXT,
    "taxonomy" TEXT NOT NULL,
    "temprament" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "colors" "Color"[],
    "coatType" TEXT NOT NULL,
    "tailType" "TailType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lost_pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "spotId" TEXT,
    "lostPetId" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxonomy" TEXT NOT NULL,
    "temprament" TEXT NOT NULL,
    "height" TEXT,
    "weight" TEXT,
    "colors" TEXT,
    "coatType" TEXT,
    "tailType" "TailType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_lostPetId_fkey" FOREIGN KEY ("lostPetId") REFERENCES "lost_pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_spotterId_fkey" FOREIGN KEY ("spotterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_pets" ADD CONSTRAINT "lost_pets_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_lostPetId_fkey" FOREIGN KEY ("lostPetId") REFERENCES "lost_pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
