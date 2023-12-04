/*
  Warnings:

  - The primary key for the `schools` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "school_metrics" DROP CONSTRAINT "school_metrics_id_escola_fkey";

-- AlterTable
ALTER TABLE "school_metrics" ALTER COLUMN "ano" SET DATA TYPE TEXT,
ALTER COLUMN "id_escola" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "schools" DROP CONSTRAINT "schools_pkey",
ALTER COLUMN "id_escola" SET DATA TYPE TEXT,
ALTER COLUMN "id_municipio" SET DATA TYPE TEXT,
ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id_escola");

-- AddForeignKey
ALTER TABLE "school_metrics" ADD CONSTRAINT "school_metrics_id_escola_fkey" FOREIGN KEY ("id_escola") REFERENCES "schools"("id_escola") ON DELETE NO ACTION ON UPDATE NO ACTION;
