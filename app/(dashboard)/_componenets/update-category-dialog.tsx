"use client";

import { TransactionType } from "@/lib/types";
import {
  updateCategorySchema,
  UpdateCategorySchemaType,
} from "@/schema/categories-schema";
import { Fragment, ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategory } from "@/app/(dashboard)/_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface PropsTypes {
  trigger: ReactNode;
  successCallback: (category: Category) => void;
  category: Category;
}

const UpdateCategoryDialog = ({
  category,
  successCallback,
  trigger,
}: PropsTypes) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateCategorySchemaType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      icon: category.icon,
      type: category.type as TransactionType,
      id: category.id,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type: undefined,
      });

      toast.success(`Category ${data.name} updated successfully 🎉`, {
        id: "update-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories", "update"],
      });

      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error("Something went wrong during updating category.", {
        id: "update-category",
      });
    },
  });

  const handleSubmit = useCallback(
    (values: UpdateCategorySchemaType) => {
      toast.loading("Updating category...", {
        id: "update-category",
      });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update
            <span className={"m-1"}>
              {category.icon} {category.name}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            All trnsactions will be updated accordingly
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[6.25rem] w-full "
                        >
                          {form.watch("icon") ? (
                            <div
                              className={cn("flex flex-col items-center gap-2")}
                            >
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div
                              className={cn("flex flex-col items-center gap-2")}
                            >
                              <CircleOff className="h-12 w-12" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          theme={theme.resolvedTheme}
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Select the icon representing this category in the
                    application
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isPending}
          >
            {!isPending ? "Update" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryDialog;
