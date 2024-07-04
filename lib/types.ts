import { Category, Transaction } from "@prisma/client";

export type TransactionType = "income" | "expense";

export type TimeFrame = "year" | "month";

export type Period = {
  year: number;
  month: number;
};

type FormattedTransactionType = Transaction & {
  type: TransactionType;
};

export type CategoryMappedIntoTransactionType = Omit<
  FormattedTransactionType,
  "category"
> & { category: Category & Omit<Category, keyof Category> };
