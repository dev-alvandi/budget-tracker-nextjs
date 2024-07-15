import prisma from "@/lib/prisma";
import { Period, TimeFrame } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeFrame: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(1990).max(2300),
});

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const timeFrame = searchParams.get("timeFrame");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParasm = getHistoryDataSchema.safeParse({
    timeFrame,
    month,
    year,
  });

  if (!queryParasm.success) {
    return Response.json(queryParasm.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParasm.data.timeFrame, {
    month: queryParasm.data.month,
    year: queryParasm.data.year,
  });

  return Response.json(data);
};

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
  userId: string,
  timeFrame: TimeFrame,
  period: Period
) => {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
};

type HistoryDaya = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

const getYearHistoryData = async (userId: string, year: number) => {
  const res = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!res || res.length === 0) {
    return [];
  }

  const history: HistoryDaya[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = res.find((row) => row.month === i);

    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      expense,
      income,
      month: i,
      year,
    });
  }

  return history;
};

const getMonthHistoryData = async (
  userId: string,
  year: number,
  month: number
) => {
  const res = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });

  console.log(res);

  if (!res || res.length === 0) {
    return [];
  }

  const history: HistoryDaya[] = [];

  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = res.find((row) => row.day === i);

    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  return history;
};
