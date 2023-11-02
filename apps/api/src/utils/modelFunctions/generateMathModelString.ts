import { ModelMathEquations } from '../models';

export default function generateMathModelString(
  modelEquations: ModelMathEquations
): string {
  let allEquations = `${modelEquations.objectiveFunction};\n\n`;

  const constraintKeys = Object.keys(modelEquations.constraints);

  constraintKeys.forEach((key) => {
    allEquations += `${modelEquations.constraints[key].leftSide} ${modelEquations.constraints[key].inequalitySign} ${modelEquations.constraints[key].rightSide};\n`;
  });

  allEquations += '\n';
  allEquations += modelEquations.variablesNature;
  allEquations += '\n\nEND';

  return allEquations
    .replaceAll(' 0 + ', ' ')
    .replaceAll(' 0 - ', ' ')
    .replaceAll('d', '')
    .replaceAll('_c', '') // to remove c from X variables and not the Ccd VariableName
    .replaceAll('f', '')
    .replaceAll('p', '')
    .replaceAll('_', '')
    .toUpperCase();
}
