export interface Worktype {
    id: string;
    clientId: string;
    createdAt: string;
    createdBy: string;
    name: string;
    rate: number;
    updatedAt: string;
    updatedBy: string;
}

export function createWorktype(worktype: Partial<Worktype>) {
    return {
        id: worktype.id,
        ...worktype,
    } as Worktype;
}
