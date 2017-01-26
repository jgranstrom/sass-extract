const path = require('path');

function findAbsolutePath(extractions, relativePath) {
  const filenames = Object.keys(extractions);
  
  for(let i = 0; i < filenames.length; i++) {
    if(filenames[i].match(relativePath)) {
      return filenames[i];
    }
  }

  return relativePath;
}

function getImportAbsolutePath(extractions, url, prev) {
  let absolutePath = path.join(path.dirname(prev), url);
  let extension = path.extname(prev);

  if(path.extname(absolutePath) !== extension) {
    absolutePath += extension;
  }

  if(prev === 'stdin') {
    absolutePath = findAbsolutePath(extractions, absolutePath);
  }

  return absolutePath;
}

function getImportResult(extractions, url, prev) {
  const absolutePath = getImportAbsolutePath(extractions, url, prev);
  const contents = extractions[absolutePath].injectedData;

  return { file: absolutePath, contents };
}

function makeImporter(extractions) {
  return function(url, prev, done) {
    try {
      const result = getImportResult(extractions, url, prev);
      done(result);
    } catch(err) {
      done(err);
    }
  }
}

function makeSyncImporter(extractions) {
  return function(url, prev) {
    try {
      const result = getImportResult(extractions, url, prev);
      return result;
    } catch(err) {
      // note: importer must return errors
      return err;
    }
  }
}

exports.makeImporter = makeImporter;
exports.makeSyncImporter = makeSyncImporter;