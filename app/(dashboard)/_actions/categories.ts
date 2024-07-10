"use server";

import prisma from "@/lib/prisma";
import {
  createCategorySchema,
  CreateCategorySchemaType,
  deleteCategorySchema,
  DeleteCategorySchemaType,
  updateCategorySchema,
  UpdateCategorySchemaType,
} from "@/schema/categories-schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateCategory = async (form: CreateCategorySchemaType) => {
  const parsedBody = createCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Bad request during creating category. (/Noah)");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
};

export const UpdateCategory = async (form: UpdateCategorySchemaType) => {
  const parsedBody = updateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid inputs during updating category. (/Noah)");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type, id } = parsedBody.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (
    !existingCategory ||
    (name === existingCategory.name && icon === existingCategory.icon)
  ) {
    throw new Error("Bad request during updating category. (/Noah)");
  }

  await prisma.$transaction([]);

  const updatedCategory = await prisma.category.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      name,
      icon,
      type,
    },
  });

  return updatedCategory;
};

export const DeleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedBody = deleteCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Bad request during creating category. (/Noah)");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, type, id } = parsedBody.data;

  return await prisma.category.delete({
    where: {
      userId: user.id,
      id,
      type,
    },
  });
};
