import { FetchAppDetailsDocument, FetchAppDetailsQuery } from "../generated/graphql";
import { saleorApp } from "../saleor-app";
import { createClient } from "./graphql";

export const getValue = async (saleorDomain: string, key: string) => {
  const authData = await saleorApp.apl.get(saleorDomain);
  if (!authData) {
    throw Error(`Couldn't find auth data for domain ${saleorDomain}`);
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  const item = (
    await client.query<FetchAppDetailsQuery>(FetchAppDetailsDocument).toPromise()
  ).data?.app?.privateMetadata!.find((i) => i.key === key);

  if (item === undefined) {
    throw Error("Metadata not found.");
  }
  return item.value;
};
