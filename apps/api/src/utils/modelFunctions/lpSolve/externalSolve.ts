import fs from 'fs';
import path from 'path';
import execFile from 'child_process';
import { ModelResult } from '../../models';
import { formatFromJSON } from './reformat';

function cleanData(text: string) {
  // Divide el texto en líneas
  let lines = text.split('\n');

  // Inicializa el objeto de resultado
  const result: Partial<ModelResult> = {};
  lines = lines.filter((line) => line !== '');

  // Extrae el valor de la función objetivo
  const objectiveFunctionMatch = lines[0].match(/(\d+\.\d+)/);

  if (objectiveFunctionMatch) {
    result.result = parseFloat(objectiveFunctionMatch[0]);
  }

  // Procesa las líneas de variables
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(/\s+/);

    if (parts.length === 2) {
      // Asigna el valor de la variable al objeto de resultado
      const variableName = parts[0];
      const variableValue = parseFloat(parts[1]);
      result[variableName] = variableValue;
    }
  }

  return result;
}

export function externalSolve(model): Promise<ModelResult> {
  return new Promise((resolve, reject) => {
    try {
      // Convert JSON model to lp_solve format
      const data = formatFromJSON(model);

      const scriptPath = path
        .join(__dirname, '/lp_solve_5.5/lp_solve/bin/osx64/lp_solve')
        .replace('dist', 'src');

      const textPath = path
        .join(__dirname, '/temp/out.txt')
        .replace('dist', 'src');
      // Write the model data to a file
      fs.writeFile(textPath, data, (err) => {
        if (err) reject(err);

        const exec = execFile.execFile;

        // Execute the external process
        exec(scriptPath, [textPath], (error, data_) => {
          if (error) {
            if (error.code === 1) {
              // Handle specific exit code 1 as needed
              resolve({
                ...cleanData(data_),
                bounded: true,
                feasible: true,
                isIntegral: true,
              } as ModelResult);
            } else {
              // Handle other error cases
              const codes = {
                '-2': 'Out of Memory',
                // Add more error codes as needed
              };

              const retObj = {
                code: error.code,
                meaning: codes[error.code] || 'Unknown Error',
                data: data_,
              };

              reject(retObj);
            }
          } else {
            // Process completed successfully
            resolve({
              ...cleanData(data_),
              bounded: true,
              feasible: true,
              isIntegral: true,
            } as ModelResult);
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
