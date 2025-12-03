import { ProfileSectionKey } from '../constants/profileSections';

export type MainStackParamList = {
  Dashboard: undefined;
  ProfileSection: { section: ProfileSectionKey };
};

