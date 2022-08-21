export interface ChartHour {
    num: number;
    day: string;
    hours: number;
}

export interface Hour {
    clientId: string;
    createdAt: string;
    createdBy: string;
    marked: number;
    updatedAt: string;
    updatedBy: string;
    userId: string;
    worksiteId: string;
    worksiteName: string;
    worktypeId: string;
    worktypeName: string;
    id?: string;
}

export function createHour(hour: Partial<Hour>) {
    return {
        id: hour.id,
        ...hour,
    } as Hour;
}
