export interface IAddAuthor {
  name: string;
  birth_date: string;
}

export interface IUpdateAuthorRequest {
  name?: string;
  birth_date?: string;
  author_id: number;
}
