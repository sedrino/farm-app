import { faker } from "@faker-js/faker";
import { queryOptions } from "@tanstack/react-query";

import { client } from "@/query/client";

const defaultData: Person[] = Array.from({ length: 10 }, () => ({
  id: faker.string.alphanumeric(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int({ min: 18, max: 100 }),
  visits: faker.number.int({ min: 0, max: 200 }),
  status: faker.helpers.arrayElement([
    "Single",
    "In Relationship",
    "Complicated",
  ]),
  progress: faker.datatype.number({ min: 0, max: 100 }),
}));
export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};
export const peopleQuery = queryOptions({
  queryKey: ["people"],
  queryFn: () =>
    new Promise<Person[]>((resolve) =>
      setTimeout(() => resolve(defaultData), 300)
    ),
});
export const personQuery = queryOptions({
  queryKey: ["person"],
  queryFn: () => {
    return defaultData[0];
  },
});
export const temperatureSensorsQuery = queryOptions({
  queryKey: ["temperature-sensors"],
  queryFn: () => {
    const result = client.examples["temperature-sensors"].$get({
      query: {
        page: "1",
        pageSize: "1",
      },
    });
    return result;
  },
});
export const orgNameQueryOptions = () =>
  queryOptions({
    queryKey: ["org-name"],
    queryFn: () => {
      return { name: "Org 1", slug: `org-1` };
    },
  });
