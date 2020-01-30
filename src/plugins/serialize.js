import { serialize } from '../serialize';

/**
 * Replace variables values with their serialized variant
 * e.g. Instead of { value: 123, unit: 'px' } output { value: '123px' }
 */
export function run() {
  return {
    postValue: ({ value, sassValue, sass }) => {
      return { value: { value: serialize(sassValue, false, sass) }, sassValue };
    }
  }
}
