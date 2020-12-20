import * as compactPlugin from './compact';
import * as serializePlugin from './serialize';

/**
 * Combine serialize and compact plugins to get a minimal output of variables
 */
export function run() {
  const compactInstance = compactPlugin.run();
  const serializeInstance = serializePlugin.run();

  return {
    postValue: serializeInstance.postValue,
    postExtract: compactInstance.postExtract,
  };
}
