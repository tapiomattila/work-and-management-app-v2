export interface Worksite {
    id: string;
    clientId: string;
    name: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deleted: boolean;
    locationInfo: Address;
    users: string[];
    marked?: number
}

interface Address {
    city: string;
    postalCode: string;
    street: string;
}

export function createWorksite(worksite: Partial<Worksite>) {
    return {
        id: worksite.id,
        deleted: false,
        ...worksite,
    } as Worksite;
}
