import fs from "fs";
import { json2csv } from "json-2-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { City, Metric, RawSchool, School } from "@/models";

const schoolsUrl = "http://educacao.dadosabertosbr.org/api/escola/";
const citiesUrl = "http://educacao.dadosabertosbr.org/api/cidades/";

interface SchoolWithNames extends School {
  nome: string | null;
}

async function readJsonFile(filePath: string): Promise<{
  schools: SchoolWithNames[];
  metrics: Metric[];
  // cities: City[];
} | null> {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const dataWithoutNames: RawSchool[] = JSON.parse(jsonData);

    // const citiesPromises: Promise<City>[] = dataWithoutNames.map(
    //   async (school: RawSchool) => {
    //     const { id_municipio, sigla_uf } = school;

    //     let nome = null;

    //     try {
    //       const { data } = await axios.get(
    //         citiesUrl + sigla_uf?.toLocaleLowerCase()
    //       );
    //       console.log(data);

    //       data.map((city: string) => {
    //         const cityParts = city.split(":");

    //         if ((nome = cityParts[1])) return;

    //         if (id_municipio == cityParts[0]) nome = cityParts[1];
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }

    //     return {
    //       id_municipio,
    //       sigla_uf,
    //       nome,
    //     };
    //   }
    // );
    // const cities: City[] = await Promise.all(citiesPromises);

    const schoolsWithNamesPromises: Promise<SchoolWithNames>[] =
      dataWithoutNames.map(async (school: RawSchool) => {
        const { id_escola } = school;
        let nome = null;

        try {
          const { data } = await axios.get(schoolsUrl + id_escola);
          if (data) nome = data.nome;
        } catch (error) {}

        return {
          id_escola,
          nome,
          id_municipio: school.id_municipio,
          sigla_uf: school.sigla_uf,
          rede: school.rede,
          ensino: school.ensino,
        };
      });

    const schoolsWithNames: SchoolWithNames[] = await Promise.all(
      schoolsWithNamesPromises
    );
    const uniqueSchoolsMap: Map<string, SchoolWithNames> = new Map();
    schoolsWithNames.forEach((school: SchoolWithNames) => {
      if (!school.id_escola) return;
      uniqueSchoolsMap.set(school.id_escola, school);
    });

    const uniqueSchools: SchoolWithNames[] = Array.from(
      uniqueSchoolsMap.values()
    );

    const metrics: Metric[] = dataWithoutNames.map((school: RawSchool) => {
      return {
        id_metrica: uuidv4(),
        ano: school.ano,
        id_escola: school.id_escola,
        ensino: school.ensino,
        anos_escolares: school.anos_escolares,
        ideb: school.ideb,
        taxa_aprovacao: school.taxa_aprovacao,
        indicador_rendimento: school.indicador_rendimento,
        nota_saeb_matematica: school.nota_saeb_matematica,
        nota_saeb_lingua_portuguesa: school.nota_saeb_lingua_portuguesa,
        nota_saeb_media_padronizada: school.nota_saeb_media_padronizada,
        projecao: school.projecao,
      };
    });

    return { schools: uniqueSchools, metrics };
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

async function jsonToCsv(
  filePath: string,
  outputSchoolsCsvFilePath: string,
  outputMetricsCsvFilePath: string,
  outputCitiesCsvFilePath: string
): Promise<void> {
  const data = await readJsonFile(filePath);
  if (!data) {
    console.error("No data to convert.");
    return;
  }

  try {
    const schoolsCsv = await json2csv(data.schools);
    writeCsvToFile(schoolsCsv, outputSchoolsCsvFilePath);

    const metricsCsv = await json2csv(data.metrics);
    writeCsvToFile(metricsCsv, outputMetricsCsvFilePath);

    // const citiesCsv = await json2csv(data.cities);
    // writeCsvToFile(citiesCsv, outputCitiesCsvFilePath);

    console.log(
      "CSV data has been written to",
      outputSchoolsCsvFilePath,
      "and",
      outputMetricsCsvFilePath
    );
  } catch (error) {
    console.error("Error converting JSON to CSV:", error);
  }
}

function writeCsvToFile(csvData: string, outputFilePath: string): void {
  try {
    fs.writeFileSync(outputFilePath, csvData);
  } catch (error) {
    console.error("Error writing CSV to file:", error);
  }
}

const jsonFilePath = "./data/dataset.json";
const outputSchoolsCsvFilePath = "./data/schools.csv";
const outputMetricsCsvFilePath = "./data/metrics.csv";
const outputCitiesCsvFilePath = "./data/cities.csv";

jsonToCsv(
  jsonFilePath,
  outputSchoolsCsvFilePath,
  outputMetricsCsvFilePath,
  outputCitiesCsvFilePath
).catch((error) => {
  console.error("Error:", error);
});
