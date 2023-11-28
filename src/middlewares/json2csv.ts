import fs from "fs";
import { json2csv } from "json-2-csv";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { Metric, RawSchool, School } from "@/models";

const apiUrl = "http://educacao.dadosabertosbr.org/api/escola/";

interface SchoolWithNames extends School {
  nome: string | null;
}

async function readJsonFile(
  filePath: string
): Promise<{ schools: SchoolWithNames[]; metrics: Metric[] } | null> {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const dataWithoutNames: RawSchool[] = JSON.parse(jsonData);

    const schoolsWithNamesPromises: Promise<SchoolWithNames>[] =
      dataWithoutNames.map(async (school: RawSchool) => {
        const { id_escola } = school;
        let nome = null;

        try {
          const { data } = await axios.get(apiUrl + id_escola);
          if (data) nome = data.nome;

          console.log(nome);
        } catch (error) {
          console.log("NULL");
        }

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
    const schools: SchoolWithNames[] = schoolsWithNames.filter(
      Boolean
    ) as SchoolWithNames[];

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

    return { schools, metrics };
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

async function jsonToCsv(
  filePath: string,
  outputSchoolsCsvFilePath: string,
  outputMetricsCsvFilePath: string
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

jsonToCsv(
  jsonFilePath,
  outputSchoolsCsvFilePath,
  outputMetricsCsvFilePath
).catch((error) => {
  console.error("Error:", error);
});
