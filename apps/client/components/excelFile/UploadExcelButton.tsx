/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getModelDataWithExcelJSON } from '../../utils/getModelDataWithExcelJSON';

function ExcelToJsonConverter() {
  const [jsonData, setJsonData] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleFileUpload = (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    setDisabled(true);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e_) => {
        const data = e_.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // if the cell ends with 1 and not contains another 1

        Object.keys(worksheet).forEach((key) => {
          const endsWithOne = key.endsWith('1');
          const newKey = key.slice(0, -1);
          const lastCharOfNewKey = newKey.slice(-1);
          const isNumber = !isNaN(lastCharOfNewKey as any);
          if (endsWithOne && !isNumber) {
            delete worksheet[key];
          }
        });

        const jsonResult = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        const dataModel = getModelDataWithExcelJSON(jsonResult);

        setJsonData(dataModel);
      };

      reader.readAsBinaryString(file);
      setDisabled(false);
    }
  };

  // TODO: ADD LOADING
  return (
    <div>
      <h2>Excel to JSON Converter</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        disabled={disabled}
      />
      {jsonData && (
        <div>
          <h3>JSON Result:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ExcelToJsonConverter;
