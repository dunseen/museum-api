import { Transform } from 'class-transformer';

/**
 * Accepts object or stringified JSON; returns undefined when omitted.
 */
export const optionalJsonParse = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'string') {
      const v = value.trim();
      if (!v) return undefined;
      try {
        return JSON.parse(v);
      } catch {
        return undefined;
      }
    }
    return value;
  });

