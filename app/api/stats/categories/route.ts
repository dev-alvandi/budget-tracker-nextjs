import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview-schema";
import { currentUser } from "@clerk/nextjs/server";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const populatedStats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(populatedStats);
};

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "categoryId"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },

    _sum: {
      amount: true,
    },

    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const populatedStats = await Promise.all(
    stats.map(async (stat) => {
      const retrievingCategory = await prisma.category.findUnique({
        where: {
          userId,
          id: stat.categoryId,
        },
      });

      if (!retrievingCategory) {
        throw new Error("Requested category not found. (/Noah)");
      }

      return {
        ...retrievingCategory,
        _sum: stat._sum,
        categoryId: stat.categoryId,
        type: stat.type,
      };
    })
  );

  return populatedStats;
};
