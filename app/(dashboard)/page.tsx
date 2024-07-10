import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTransationDiolag from "./_componenets/create-transation-diolag";
import Overview from "./_componenets/overview";
import History from "./_componenets/history";

const DashboardPage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">
            Hello, <span className="capitalize">{user.firstName}</span>! 👋
          </p>
          <div className="flex items-center gap-3">
            <CreateTransationDiolag type="income">
              <Button
                variant={"outline"}
                className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700"
              >
                New income 🤑
              </Button>
            </CreateTransationDiolag>
            <CreateTransationDiolag type="expense">
              <Button
                variant={"outline"}
                className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700"
              >
                New expense 😥
              </Button>
            </CreateTransationDiolag>
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default DashboardPage;
