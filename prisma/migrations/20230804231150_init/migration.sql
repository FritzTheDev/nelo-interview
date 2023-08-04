-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "seats" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "Table_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    CONSTRAINT "Reservation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RestaurantAttribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RestaurantToRestaurantAttribute" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RestaurantToRestaurantAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RestaurantToRestaurantAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "RestaurantAttribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DinerToRestaurantAttribute" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DinerToRestaurantAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "Diner" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DinerToRestaurantAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "RestaurantAttribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DinerToReservation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DinerToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Diner" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DinerToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_RestaurantToRestaurantAttribute_AB_unique" ON "_RestaurantToRestaurantAttribute"("A", "B");

-- CreateIndex
CREATE INDEX "_RestaurantToRestaurantAttribute_B_index" ON "_RestaurantToRestaurantAttribute"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DinerToRestaurantAttribute_AB_unique" ON "_DinerToRestaurantAttribute"("A", "B");

-- CreateIndex
CREATE INDEX "_DinerToRestaurantAttribute_B_index" ON "_DinerToRestaurantAttribute"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DinerToReservation_AB_unique" ON "_DinerToReservation"("A", "B");

-- CreateIndex
CREATE INDEX "_DinerToReservation_B_index" ON "_DinerToReservation"("B");
