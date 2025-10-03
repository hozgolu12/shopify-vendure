/**
 * @description
 * The plugin can be configured using the following options:
 */

import { ID } from "@vendure/core";

// You can define TypeScript interfaces here if needed
export interface CreateUserArgs {
    betterAuthId: string;
    name: string;
    email: string;
    companyName?: string;
    companyType?: string;
    role?: string;
}

export interface UpdateUserArgs {
    id: ID;
    betterAuthId?: string;
    name?: string;
    email?: string;
    companyName?: string;
    companyType?: string;
    role?: string;
}