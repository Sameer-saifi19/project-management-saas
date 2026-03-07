"use client"

import { authClient } from "@/lib/auth-client"

export const useActiveWorkspace = () => {
    const {data: activeWorkspace} = authClient.useActiveOrganization()
    return activeWorkspace
} 