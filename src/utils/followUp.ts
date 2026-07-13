export function isFollowUpDue(dateValue?: string) {
  if (!dateValue) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const followUpDate = new Date(dateValue);
  followUpDate.setHours(0, 0, 0, 0);

  return followUpDate <= today;
}
