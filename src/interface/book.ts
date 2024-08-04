export interface IAddBookRequest {
    title: string;
    isbn: string;
    author_name: string;
    publish_date: Date;
    author_birth_date: Date;
}

export interface IAddMultipleBookRequest {
    title: string;
    isbn: string;
    author_id: number;
    publish_date: Date;
}

export interface IUpdateBookRequest {
    book_id: number;
    title: string;
    isbn: string;
    publish_date: Date;
    author_id: string;
}