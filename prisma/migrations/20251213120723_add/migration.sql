-- DropIndex
DROP INDEX "Deck_ownerId_idx";

-- CreateIndex
CREATE INDEX "Deck_ownerId_title_idx" ON "Deck"("ownerId", "title");
