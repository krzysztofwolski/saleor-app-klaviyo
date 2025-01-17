import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { useEffect, useState } from "react";

type Options = Record<string, string>;

interface UseFetchProps {
  url: string;
  options?: Options;
  skip?: boolean;
}

// This hook is meant to be used mainly for internal API calls
const useAppApi = ({ url, options, skip }: UseFetchProps) => {
  const { appBridgeState } = useAppBridge();

  const [data, setData] = useState<any>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);

  const fetchOptions = {
    ...options,
    headers: [
      [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
      ["authorization-bearer", appBridgeState?.token!],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const res = await fetch(url, fetchOptions);

        if (!res.ok) {
          throw new Error(`Error status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e as unknown);
      } finally {
        setLoading(false);
      }
    };

    if (appBridgeState?.ready && !skip) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchData();
    }

    return () => {
      setLoading(false);
      setError(undefined);
      setData(undefined);
    };
  }, [url, options, skip]);

  return { data, error, loading };
};

export default useAppApi;
