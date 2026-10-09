/**
 * Client-side CSV export utility
 * Exports structured array data to a downloadable CSV file.
 */

export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (rows.length === 0) return;

  const resolvedHeaders =
    headers ||
    Object.keys(rows[0]).map((key) => ({
      key: key as keyof T,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  const csvRows: string[] = [];

  // Header row
  csvRows.push(resolvedHeaders.map((h) => `"${h.label}"`).join(','));

  // Data rows
  rows.forEach((row) => {
    const values = resolvedHeaders.map((h) => {
      const val = row[h.key];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
