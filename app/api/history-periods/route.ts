import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
};

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
  const res = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "desc",
      },
    ],
  });

  const years = res.map((item) => item.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
};
