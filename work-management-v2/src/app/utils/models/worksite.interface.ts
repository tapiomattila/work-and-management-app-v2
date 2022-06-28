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
}

interface Address {
    city: string;
    postalCode: string;
    street: string;
}
