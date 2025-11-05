import { Transform } from 'class-transformer';

/**
 * Parses a comma-separated list of numbers into number[] when provided.
 * - undefined/null -> undefined (caller preserves current value)
 * - '' (empty string) -> [] (caller may treat as clear-all)
 * - '1, 2,3' or ['1','2'] -> [1,2,3]
 */
export const optionalCsvToNumberArray = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (Array.isArray(value))
      return value.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
    if (typeof value === 'string') {
      const v = value.trim();
      if (!v) return [];
      return v
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));
    }
    return undefined;
  });

/**
 * Parses a comma-separated list of strings (UUIDs) into string[] when provided.
 * - undefined/null -> undefined
 * - '' (empty string) -> []
 * - 'uuid1,uuid2' or ['uuid1'] -> ['uuid1','uuid2']
 */
export const optionalCsvToStringArray = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (Array.isArray(value))
      return value.map((v) => String(v)).filter(Boolean);
    if (typeof value === 'string') {
      const v = value.trim();
      if (!v) return [];
      return v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return undefined;
  });
