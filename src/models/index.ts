export type School = {
  id_escola?: string;
  nome?: string;
  id_municipio?: string;
  sigla_uf?: string;
  rede?: string;
  ensino?: string;
};

export type Metric = {
  id_metrica?: string;
  id_escola?: string;
  ano?: string;
  ensino?: string;
  anos_escolares?: string;
  taxa_aprovacao?: string;
  indicador_rendimento?: string;
  nota_saeb_matematica?: string;
  nota_saeb_lingua_portuguesa?: string;
  nota_saeb_media_padronizada?: string;
  projecao?: string;
};
