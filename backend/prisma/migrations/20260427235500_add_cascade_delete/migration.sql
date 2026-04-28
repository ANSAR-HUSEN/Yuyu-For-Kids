-- DropForeignKey
ALTER TABLE "chat_logs" DROP CONSTRAINT "chat_logs_child_id_fkey";

-- DropForeignKey
ALTER TABLE "progress" DROP CONSTRAINT "progress_child_id_fkey";

-- DropForeignKey
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_child_id_fkey";

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;
