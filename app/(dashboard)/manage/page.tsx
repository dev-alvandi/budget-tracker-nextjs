"use client";

import CurrencyComboBox from "@/components/currency-combo-box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fragment } from "react";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  PlusSquare,
  RotateCcw,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CreateCategoryDialog from "../_componenets/create-category-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_componenets/delete-category-dialog";
import UpdateCategoryDialog from "../_componenets/update-category-dialog";

const ManagePage = () => {
  return (
    <Fragment>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </Fragment>
  );
};

export default ManagePage;

const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoresQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoresQuery.data && categoresQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoresQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="w-12 h-12 items-center rounded-lg bg-red-400/10 text-red-500" />
              ) : (
                <TrendingUp className="w-12 h-12 items-center rounded-lg bg-emerald-400/10 text-emerald-500" />
              )}
              <div className="flex flex-col gap-1.5">
                <div>
                  <span className="capitalize">{type}s</span> categories
                </div>
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoresQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="w-4 h-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>

        <Separator />

        {!dataAvailable && (
          <div className="flex flex-col items-center justify-center h-40 w-full">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}

        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-col sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoresQuery.data.map((category: Category) => (
              <CategoryCard
                key={category.name}
                category={category}
                successCallback={() => categoresQuery.refetch()}
              />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const CategoryCard = ({
  category,
  successCallback,
}: {
  category: Category;
  successCallback: (category: Category) => void;
}) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <DeleteCategoryDialog
          successCallback={successCallback}
          category={category}
          trigger={
            <Button
              className="flex w-full border-separate items-center gap-2 rounded-t-none rounded-br-none text-muted-foreground hover:bg-red-500/20"
              variant={"secondary"}
            >
              <TrashIcon className="w-4 h-4" />
              Remove
            </Button>
          }
        />
        <UpdateCategoryDialog
          successCallback={successCallback}
          category={category}
          trigger={
            <Button
              className="flex w-full border-separate items-center gap-2 rounded-t-none rounded-bl-none text-muted-foreground hover:bg-blue-500/20"
              variant={"secondary"}
            >
              <RotateCcw className="w-4 h-4" />
              Update
            </Button>
          }
        />
      </div>
    </div>
  );
};
