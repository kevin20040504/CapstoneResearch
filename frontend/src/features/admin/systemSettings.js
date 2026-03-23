
export function mapSettingsToForm(apiSettings) {
  if (!apiSettings) return null;
  return {
    institutionName: apiSettings.institution_name ?? '',
    institutionShortName: apiSettings.institution_short_name ?? '',
    address: apiSettings.institution_address ?? '',
    academicYear: apiSettings.academic_year ?? '',
    semester: apiSettings.semester ?? '2nd Semester',
    emailNotifications: Boolean(apiSettings.email_notifications_enabled),
  };
}


export function mapFormToApiPayload(form) {
  return {
    institution_name: form.institutionName?.trim() ?? '',
    institution_short_name: form.institutionShortName?.trim() ?? '',
    institution_address: form.address?.trim() ?? '',
    academic_year: form.academicYear?.trim() ?? '',
    semester: form.semester ?? '',
    email_notifications_enabled: Boolean(form.emailNotifications),
  };
}
