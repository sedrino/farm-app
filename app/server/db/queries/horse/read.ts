import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableHorse } from "@/server/db/schema";

interface FindHorsesPaginatedInput {
  page: number;
  pageSize: number;
  search?: string;
  breed?: string;
  ageRange?: string;
  specialNeeds?: string;
}

export async function findHorsesPaginated({
  page,
  pageSize,
  search,
  breed,
  ageRange,
  specialNeeds,
}: FindHorsesPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (search) {
    filters.push(ilike(tableHorse.name, `%${search}%`));
  }

  if (breed) {
    filters.push(eq(tableHorse.breed, breed));
  }

  if (ageRange) {
    const [minAge, maxAge] = ageRange.split("-");
    filters.push(
      and(
        eq(tableHorse.dateOfBirth, minAge),
        eq(tableHorse.dateOfBirth, maxAge)
      )
    );
  }

  if (specialNeeds) {
    filters.push(ilike(tableHorse.specialNeeds, `%${specialNeeds}%`));
  }

  const horses = await db.query.tableHorse.findMany({
    with: {
      owner: true,
      stall: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return horses;
}

export async function getHorseById(horseId: string) {
  const results = await db
    .select()
    .from(tableHorse)
    .where(eq(tableHorse.horseId, horseId));

  return results[0] || null; // Return the first result or null if not found
}
