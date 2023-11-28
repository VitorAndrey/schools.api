import fs from "fs";
import { json2csv } from "json-2-csv";
import axios from "axios";

import { Metric, School } from "@/models";

const apiUrl = "http://educacao.dadosabertosbr.org/api/escola/";

async function readJsonFile(filePath: string): Promise<any> {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const dataWithoutNames: School[] = JSON.parse(jsonData);

    const schoolsWithNamesPromises: Promise<School>[] = dataWithoutNames.map(
      async (school: School) => {
        const { id_escola } = school;
        let nome = null;

        try {
          const { data } = await axios.get(apiUrl + id_escola);
          if (data) nome = data.nome;

          console.log(nome);
        } catch (error) {
          console.log("NOT FOUND");
        }

        return {
          ...school,
          nome,
        };
      }
    );

    const metricsPromises = dataWithoutNames.map(async (school) => {});

    const schools = await Promise.all(schoolsWithNamesPromises);
    const metrics = await Promise.all(metricsPromises);

    return { schools, metrics };
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

async function jsonToCsv(filePath: string): Promise<string | null> {
  const jsonData = await readJsonFile(filePath);
  if (!jsonData) {
    console.error("No data to convert.");
    return null;
  }

  try {
    const csv = await json2csv(jsonData);
    return csv;
  } catch (error) {
    console.error("Error converting JSON to CSV:", error);
    return null;
  }
}

function writeCsvToFile(csvData: string, outputFilePath: string): void {
  try {
    fs.writeFileSync(outputFilePath, csvData);
    console.log("CSV data has been written to", outputFilePath);
  } catch (error) {
    console.error("Error writing CSV to file:", error);
  }
}

const jsonFilePath = "./data/dataset.json";
const outputCsvFilePath = "./data/dataset.csv";
jsonToCsv(jsonFilePath)
  .then((csvData) => {
    if (csvData) {
      writeCsvToFile(csvData, outputCsvFilePath);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
