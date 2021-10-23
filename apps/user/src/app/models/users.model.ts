import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export type UserRole = Record<string, never>; // Currently UserRole does not have any data. It only has the key

export interface UserCore {
    name: string;
    role: number;
}

export interface UserWithFirestamp extends UserCore {
    timestamp: {
        nanoseconds: number;
        seconds: number;
    }
}

export interface UserWithTimestamp extends UserCore {
    timestamp: Date | null;
}

export interface UserWithKey {
    id: string;
    doc: UserWithTimestamp;
}

export interface PaginatedUsers {
    isFirstPage: boolean;
    isLastPage: boolean;
    firstDoc: QueryDocumentSnapshot<UserWithFirestamp> | null;
    lastDoc: QueryDocumentSnapshot<UserWithFirestamp> | null;
    allDocs?: UserWithKey[];
}

export interface UserPageRequest {
    startAfter?: QueryDocumentSnapshot<UserWithFirestamp> | null;
    endBefore?: QueryDocumentSnapshot<UserWithFirestamp> | null;
    limit?: number;
}
