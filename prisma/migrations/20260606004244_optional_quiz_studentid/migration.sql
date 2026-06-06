-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_studentId_fkey";

-- AlterTable
ALTER TABLE "QuizResult" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
