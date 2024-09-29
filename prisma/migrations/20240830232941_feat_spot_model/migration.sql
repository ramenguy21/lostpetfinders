-- CreateTable
CREATE TABLE "Spot" (
    "id" SERIAL NOT NULL,
    "spotterId" INTEGER NOT NULL,
    "taxonomy" TEXT NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "pictures" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);
