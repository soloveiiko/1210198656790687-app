/*
  Warnings:

  - Made the column `totalPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "id", "name", "status", "totalPrice") SELECT "createdAt", "id", "name", "status", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
