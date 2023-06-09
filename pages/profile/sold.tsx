import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import useSWR from "swr";
import { useEffect, useState } from "react";

const Sold: NextPage = () => {
  const { data } = useSWR("/api/users/me/record?kind=Sales");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) setIsLoading(false);
  }, [data, isLoading]);

  return (
    <Layout title="판매내역" pageTitle="판매내역 | 당근마켓" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        {isLoading ? (
          <div className="w-full flex justify-center mt-10 text-orange-400 text-2xl font-bold">
            Loading
          </div>
        ) : (
          <ProductList kind="Purchase" />
        )}
      </div>
    </Layout>
  );
};

export default Sold;
