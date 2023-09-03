import {patchFs} from 'fs-monkey';
import fs from 'fs';

const originalReadFileSync = fs.readFileSync;
const originalReadFile = fs.readFile;

function getInjectedData(path, extractions, entryFilename) {
  path = fs.realpathSync(path);

  if (path in extractions && path !== entryFilename) {
    return extractions[path].injectedData;
  }
}

export function patchReadFile(extractions, entryFilename) {

  patchFs({
    readFileSync(path, options) {
      const injectedData = getInjectedData(path, extractions, entryFilename);

      if (injectedData) {
        return injectedData;
      }

      return originalReadFileSync(path, options);
    },

    readFile(path, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }

      const injectedData = getInjectedData(path, extractions, entryFilename);

      if (injectedData) {
        callback(null, injectedData);
      }
      else {
        originalReadFile(path, options, callback);
      }
    }
  });
}

export function unpatchReadFile() {
  fs.readFileSync = originalReadFileSync;
  fs.readFile = originalReadFile;
}
