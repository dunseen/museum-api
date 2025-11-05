import { isDate } from 'class-validator';

type DiffResult = Record<string, { from: any; to: any }>;

const TRACKED_KEYS = new Set([
  'name',
  'scientificName',
  'commonName',
  'description',
  'collectLocation',
  'collectedAt',
  'determinatedAt',
  'geolocation',
  'coordinates',
  'state',
  'city',
  'collector',
  'determinator',
  'taxons',
  'characteristics',
]);

/**
 * Compare two coordinate arrays for differences
 */
const compareCoordinates = (original: number[], updated: number[]): boolean => {
  return (
    original.length !== updated.length ||
    original.some((coord, index) => coord !== updated[index])
  );
};

/**
 * Compare two arrays of objects with IDs and return diff for taxons
 */
const compareTaxons = (
  original: any[],
  updated: any[],
): { from: string; to: string } | null => {
  const updatedIds = new Set(updated.map((u) => u?.id));
  const originalIds = new Set(original.map((o) => o?.id));

  const hasChanges =
    original.every((o) => !updatedIds.has(o?.id)) ||
    updated.some((u) => !originalIds.has(u?.id));

  if (!hasChanges) return null;

  return {
    from: `${original[0].name} (${original[0].hierarchy?.name || 'Unknown'})`,
    to: `${updated[0].name} (${updated[0].hierarchy?.name || 'Unknown'})`,
  };
};

/**
 * Compare two arrays of objects with IDs and return diff for characteristics
 */
const compareCharacteristics = (
  original: any[],
  updated: any[],
): { from: string[]; to: string[] } | null => {
  const updatedIds = new Set(updated.map((u) => u?.id));
  const originalIds = new Set(original.map((o) => o?.id));

  const hasChanges =
    original.some((o) => !updatedIds.has(o?.id)) ||
    updated.some((u) => !originalIds.has(u?.id));

  if (!hasChanges) return null;

  return {
    from: original.map((o) => o.name),
    to: updated.map((u) => u.name),
  };
};

/**
 * Handle array comparison logic
 */
const handleArrayDiff = (
  key: string,
  original: any[],
  updated: any[],
): { from: any; to: any } | null => {
  // Coordinates array
  if (key === 'coordinates') {
    return compareCoordinates(original, updated)
      ? { from: original, to: updated }
      : null;
  }

  // Taxons array
  if (key === 'taxons') {
    return compareTaxons(original, updated);
  }

  // Characteristics or other arrays with IDs
  return compareCharacteristics(original, updated);
};

/**
 * Normalize string values by trimming whitespace
 */
const normalizeString = (value: any): any => {
  return typeof value === 'string' ? value.trim() : value;
};

/**
 * Compare two values with string normalization
 */
const areValuesEqual = (fromValue: any, toValue: any): boolean => {
  const normalizedFrom = normalizeString(fromValue);
  const normalizedTo = normalizeString(toValue);
  return normalizedFrom === normalizedTo;
};

/**
 * Creates a diff between two objects, tracking only specified keys
 */
export const createDiff = (from: any, to: any): DiffResult => {
  const diff: DiffResult = {};

  if (!from || !to) {
    return diff;
  }

  for (const key of Object.keys(to)) {
    const fromValue = from[key];
    const toValue = to[key];

    // Skip if both values are null or if from value is null
    if (typeof toValue !== 'object' || toValue === null || fromValue === null) {
      // Primitive value comparison with string normalization
      if (!areValuesEqual(fromValue, toValue) && TRACKED_KEYS.has(key)) {
        diff[key] = {
          from: normalizeString(fromValue),
          to: normalizeString(toValue),
        };
      }
      continue;
    }

    // Handle Date objects
    if (isDate(toValue) && isDate(fromValue)) {
      if (toValue.getTime() !== fromValue.getTime()) {
        diff[key] = { from: fromValue, to: toValue };
      }
      continue;
    }

    // Handle arrays
    if (Array.isArray(toValue) && Array.isArray(fromValue)) {
      const arrayDiff = handleArrayDiff(key, fromValue, toValue);
      if (arrayDiff) {
        diff[key] = arrayDiff;
      }
      continue;
    }

    // Handle nested objects
    const nestedDiff = createDiff(fromValue, toValue);
    for (const nestedKey of Object.keys(nestedDiff)) {
      if (TRACKED_KEYS.has(nestedKey) && nestedKey !== 'state') {
        diff[key] = nestedDiff[nestedKey];
      }
    }
  }

  return diff;
};
