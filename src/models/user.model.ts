export interface User {
    uid: string;
    token: string;
    username: string;
    email: string;
    firstname?: string;
    lastname?: string;
    expire?: number;
    tokenValid?: boolean;
}