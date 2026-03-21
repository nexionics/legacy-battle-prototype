/**
 * Extracts up to `maxDigits` numeric characters from an arbitrary string.
 */
export const extractOTPDigits = (value: string, maxDigits: number): string[] =>
  (value.match(/\d/g) ?? []).slice(0, maxDigits);

/**
 * Returns true only when every slot is filled with a single digit.
 */
export const isOTPComplete = (slots: string[]): boolean =>
  slots.every((s) => s.length === 1);

/**
 * Reads numeric digits from the clipboard.
 * Returns an empty array if clipboard is empty, inaccessible, or contains no digits.
 */
export const getOTPFromClipboard = async (length: number): Promise<string[]> => {
  try {
    const { hasStringAsync, getStringAsync } = await import("expo-clipboard");

    const hasContent = await hasStringAsync();
    if (!hasContent) return [];

    const content = await getStringAsync();
    return extractOTPDigits(content, length);
  } catch {
    return [];
  }
};
