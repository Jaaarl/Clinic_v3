/**
 * Generate a formatted prescription text string from structured prescriptions
 * @param {Array<{name: string, dosage: string, frequency: string, duration: string, instructions: string}>} prescriptions
 * @returns {string} Formatted prescription text
 */
export function generateResetaText(prescriptions) {
  if (!prescriptions || prescriptions.length === 0) return "";

  return prescriptions
    .filter((p) => p.name && p.name.trim())
    .map((p) => {
      let line = p.name.trim();
      if (p.dosage && p.dosage.trim()) {
        line += ` ${p.dosage.trim()}`;
      }
      if (p.frequency && p.frequency.trim()) {
        line += ` - ${p.frequency.trim()}`;
      }
      if (p.duration && p.duration.trim()) {
        line += ` for ${p.duration.trim()}`;
      }
      if (p.instructions && p.instructions.trim()) {
        line += ` (${p.instructions.trim()})`;
      }
      return line;
    })
    .join("\n");
}
