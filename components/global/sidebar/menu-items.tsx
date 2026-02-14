import { CreditCard, Folder, Settings, SquareUserRound, UserCircle2Icon, UserCog2, Users2 } from "lucide-react";
import React from "react";

export const menuItems = (
  slug: string,
): { title: string; url: string; icon: React.ReactNode }[] => [
  {
    title: "Projects",
    url: `/dashboard/${slug}/projects`,
    icon: <Folder />,
  },
  {
    title: "Members",
    url: `/dashboard/${slug}/members`,
    icon: <Users2 />,
  },
  {
    title: "Settings",
    url: `/dashboard/${slug}/settings`,
    icon: <Settings />,
  },
  {
    title: "Upgrade workspace",
    url: `/dashboard/${slug}/billings`,
    icon: <CreditCard />,
  },
];

export const personalMenuItems = (
  id: string,
): { title: string; url: string; icon: React.ReactNode }[] => [
  {
    title: "Profile and Visibility",
    url: `/user/${id}/profile`,
    icon: <UserCircle2Icon />,
  },
  {
    title: "Account",
    url: `/user/${id}/account`,
    icon: <SquareUserRound />,
  },
  {
    title: "Settings",
    url: `/user/${id}/setting`,
    icon: <UserCog2 />,
  },
];
