export function formatListName(s) {
  const last = s.last_name?.trim();
  const first = s.first_name?.trim();
  const mid = s.middle_name?.trim();
  if (last && first) {
    return mid ? `${last}, ${first} ${mid}` : `${last}, ${first}`;
  }
  return [s.first_name, s.last_name].filter(Boolean).join(' ') || s.user?.name || '—';
}

export function deriveStatusLabel(s) {
  if (s.graduation_date) return 'Graduated';
  if (s.GPA != null && s.GPA !== '') return 'Enrolled';
  return 'Pending';
}

/**
 * Maps API student to list row shape for View Records.
 * @param {object} s — raw student from paginated list
 */
export function mapStudentToListRow(s) {
  return {
    ...s,
    id: s.student_id,
    displayName: formatListName(s),
    course: s.program?.code || s.program?.name || '—',
    statusLabel: deriveStatusLabel(s),
  };
}
