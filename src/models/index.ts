type StringOrNull = string | null;

export type RawSchool = {
  ano?: string;
  sigla_uf?: string;
  id_municipio?: string;
  id_escola?: string;
  rede?: string;
  ensino?: string;
  anos_escolares?: string;
  taxa_aprovacao?: string;
  indicador_rendimento?: string;
  nota_saeb_matematica?: string;
  nota_saeb_lingua_portuguesa?: string;
  nota_saeb_media_padronizada?: string;
  ideb?: string;
  projecao?: string;
};

export type School = {
  id_escola: StringOrNull;
  id_municipio: StringOrNull;
  nome: StringOrNull;
  rede: StringOrNull;
  ensino: StringOrNull;
  anos_escolares: StringOrNull;
};

export interface SchoolWithNames extends School {
  nome: string | null;
}

export type Metric = {
  id_metrica: StringOrNull;
  id_escola: StringOrNull;
  ano: StringOrNull;
  sigla_uf: StringOrNull;
  taxa_aprovacao: StringOrNull;
  indicador_rendimento: StringOrNull;
  nota_saeb_matematica: StringOrNull;
  nota_saeb_lingua_portuguesa: StringOrNull;
  nota_saeb_media_padronizada: StringOrNull;
  ideb: StringOrNull;
  projecao: StringOrNull;
};
