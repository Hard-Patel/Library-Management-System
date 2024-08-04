export interface ILoginUserRequest {
    email: string;
    password: string;
}

export interface IAddUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface IUpdateUserRequest extends Partial<IAddUserRequest> {
    user_id: number;
}