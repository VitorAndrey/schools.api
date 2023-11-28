export type StringOrNull = string | null;

export type RawSchool = {
  sigla_uf: StringOrNull;
  id_municipio: StringOrNull;
  id_escola: StringOrNull;
  rede: StringOrNull;
  ensino: StringOrNull;
  ideb: StringOrNull;
  anos_escolares: StringOrNull;

  ano: StringOrNull;
  taxa_aprovacao: StringOrNull;
  indicador_rendimento: StringOrNull;
  nota_saeb_matematica: StringOrNull;
  nota_saeb_lingua_portuguesa: StringOrNull;
  nota_saeb_media_padronizada: StringOrNull;
  projecao: StringOrNull;
};

export type School = {
  id_escola: StringOrNull;
  id_municipio: StringOrNull;
  rede: StringOrNull;
  sigla_uf: StringOrNull;
};

export interface SchoolWithNames extends School {
  nome: string | null;
}

export type Metric = {
  id_metrica: StringOrNull;
  id_escola: StringOrNull;
  ano: StringOrNull;
  ensino: StringOrNull;
  anos_escolares: StringOrNull;
  taxa_aprovacao: StringOrNull;
  indicador_rendimento: StringOrNull;
  nota_saeb_matematica: StringOrNull;
  nota_saeb_lingua_portuguesa: StringOrNull;
  nota_saeb_media_padronizada: StringOrNull;
  projecao: StringOrNull;
};
