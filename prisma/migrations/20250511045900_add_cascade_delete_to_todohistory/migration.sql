-- DropForeignKey
ALTER TABLE "TodoHistory" DROP CONSTRAINT "TodoHistory_todoId_fkey";

-- AddForeignKey
ALTER TABLE "TodoHistory" ADD CONSTRAINT "TodoHistory_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
