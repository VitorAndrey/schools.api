-- CreateTable
CREATE TABLE "school_metrics" (
    "id_metrica" TEXT NOT NULL,
    "ano" INTEGER,
    "id_escola" BIGINT NOT NULL,
    "ensino" TEXT,
    "anos_escolares" TEXT,
    "ideb" TEXT,
    "taxa_aprovacao" TEXT,
    "indicador_rendimento" TEXT,
    "nota_saeb_matematica" TEXT,
    "nota_saeb_lingua_portuguesa" TEXT,
    "nota_saeb_media_padronizada" TEXT,
    "projecao" TEXT,

    CONSTRAINT "school_metrics_pkey" PRIMARY KEY ("id_metrica")
);

-- CreateTable
CREATE TABLE "schools" (
    "id_escola" BIGINT NOT NULL,
    "nome" TEXT,
    "id_municipio" BIGINT,
    "sigla_uf" TEXT,
    "rede" TEXT,
    "ensino" TEXT,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id_escola")
);

-- AddForeignKey
ALTER TABLE "school_metrics" ADD CONSTRAINT "school_metrics_id_escola_fkey" FOREIGN KEY ("id_escola") REFERENCES "schools"("id_escola") ON DELETE NO ACTION ON UPDATE NO ACTION;
