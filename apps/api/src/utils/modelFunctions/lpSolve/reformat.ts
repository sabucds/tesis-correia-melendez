export function formatFromJSON(model) {
  // Make sure we at least have a model
  if (!model) {
    throw new Error('Solver requires a model to operate on');
  }

  let output = '';

  const lookup = {
    max: '<=',
    min: '>=',
    equal: '=',
  };
  const rxClean = /[^A-Za-z0-9_[{}/.&#$%~'@^]/gi;

  // Build the objective statement
  if (model.opType) {
    output += `${model.opType}:`;

    // Iterate over the variables
    for (const x of Object.keys(model.variables)) {
      // Give each variable a self of 1 unless
      // it exists already
      model.variables[x][x] = model.variables[x][x] ? model.variables[x][x] : 1;

      // Does our objective exist here?
      if (model.variables[x][model.optimize]) {
        output += ` ${model.variables[x][model.optimize]} ${x.replace(
          rxClean,
          '_'
        )}`;
      }
    }
  } else {
    output += 'max:';
  }

  // Add some closure to our line thing
  output += ';\n\n';

  // And now... to iterate over the constraints
  for (const xx of Object.keys(model.constraints)) {
    for (const y of Object.keys(model.constraints[xx])) {
      if (typeof lookup[y] !== 'undefined') {
        for (const z of Object.keys(model.variables)) {
          // Does our Constraint exist here?
          if (typeof model.variables[z][xx] !== 'undefined') {
            output += ` ${model.variables[z][xx]} ${z.replace(rxClean, '_')}`;
          }
        }
        // Add the constraint type and value...
        output += ` ${lookup[y]} ${model.constraints[xx][y]}`;
        output += ';\n';
      }
    }
  }

  // Are there any ints?
  if (model.ints) {
    output += '\n\n';
    for (const xxx of Object.keys(model.ints)) {
      output += `int ${xxx.replace(rxClean, '_')};\n`;
    }
  }

  // Are there any binaries?
  if (model.binaries) {
    output += '\n\n';
    for (const xxx of Object.keys(model.binaries)) {
      output += `bin ${xxx.replace(rxClean, '_')};\n`;
    }
  }

  // Are there any unrestricted?
  if (model.unrestricted) {
    output += '\n\n';
    for (const xxxx of Object.keys(model.unrestricted)) {
      output += `unrestricted ${xxxx.replace(rxClean, '_')};\n`;
    }
  }

  // And kick the string back
  return output;
}
