export const getStatus = (exam: any) => {
  if (exam.settings?.status === 'inactive' || exam.settings?.status === 'draft') return 'inactive';
  if (exam.settings?.status === 'active') return 'active';
  return exam.is_published ? 'active' : 'inactive';
};
