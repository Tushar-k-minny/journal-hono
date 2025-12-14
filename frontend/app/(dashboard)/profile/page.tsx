import type { Metadata } from "next";
import { ProfileView } from "@/components/profile-view";

export const metadata: Metadata = {
  title: "Profile - Daily Journal",
  description: "Manage your profile and settings",
};

export default function ProfilePage() {
  return <ProfileView />;
}
