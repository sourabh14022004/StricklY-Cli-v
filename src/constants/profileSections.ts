export type ProfileSectionKey =
  | 'account'
  | 'permissions'
  | 'focus'
  | 'captured'
  | 'appearance'
  | 'streaks'
  | 'privacy'
  | 'about';

export const PROFILE_SECTIONS: Array<{
  key: ProfileSectionKey;
  label: string;
}> = [
  { key: 'account', label: 'Account' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'focus', label: 'Focus Preferences' },
  { key: 'captured', label: 'Captured Notification Rules' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'streaks', label: 'Streak & Productivity' },
  { key: 'privacy', label: 'Privacy & Security' },
  { key: 'about', label: 'About' },
];

