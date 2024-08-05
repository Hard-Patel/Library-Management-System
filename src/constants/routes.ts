export const BooksRoutes = {
  GetBooks: "",
  GetBookDetails: "/:book_id",
  AddBook: "/add-book",
  AddMultipleBook: "/add-multiple-books",
  UpdateBook: "/update-book",
  DeleteBook: "/delete-book/:book_id",
};

export const UsersRoutes = {
  LoginUsers: "/login",
  GetUsers: "",
  GetUserDetails: "/get-profile",
  AddUser: "/add-user",
  UpdateUser: "/update-user",
  DeleteUser: "/delete-user/:user_id",
};

export const TransactionsRoutes = {
  AssignBook: "/assign-book",
  ReturnBook: "/return-book",
};
