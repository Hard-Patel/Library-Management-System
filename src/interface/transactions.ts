export interface IAssignBookRequest {
  book_id: number;
  assign_time: Date;
  return_time: Date;
}

export interface IReturnBookRequest {
  transaction_id: number;
  return_date: Date;
}

export interface IGetTransactionsRequest {
  all?: "1" | "2";
  due?: "1" | "2";
}
