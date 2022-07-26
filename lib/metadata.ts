import {
  FetchAppDetailsDocument,
  FetchAppDetailsQuery,
} from "../generated/graphql";
import { createClient } from "./graphql";
import { getEnvVars } from "./environment";

export const getValue = async (saleorDomain: string, key: string) => {
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: (await getEnvVars()).SALEOR_AUTH_TOKEN })
  );

  const item = (
    await client
      .query<FetchAppDetailsQuery>(FetchAppDetailsDocument)
      .toPromise()
  ).data?.app?.privateMetadata!.find((i) => i.key === key);

  if (item === undefined) {
    throw new Error("Metadata not found.");
  }
  return item.value;
};
