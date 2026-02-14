import { CreditCard, Folder, Settings, Users2 } from "lucide-react";
import React from "react";

export const menuItems = (slug: string): {title : string, url: string, icon: React.ReactNode}[] => [
    {
        title: "Projects",
        url: `/dashboard/${slug}/projects`,
        icon: <Folder/>
    },
    {
        title: "Members",
        url: `/dashboard/${slug}/members`,
        icon: <Users2/>
    },
    {
        title: "Settings",
        url: `/dashboard/${slug}/settings`,
        icon: <Settings/>
    },
    {
        title: "Upgrade workspace",
        url: `/dashboard/${slug}/billings`,
        icon: <CreditCard/>
    }
]