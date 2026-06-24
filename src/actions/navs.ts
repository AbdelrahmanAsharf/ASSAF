// actions/navs.ts
import { db } from "@/lib/prisma";

export async function getNavs() {
  return await db.category.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      subCategories: {
        orderBy: { createdAt: "asc" },
        include: {
          subSubCategories: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
}