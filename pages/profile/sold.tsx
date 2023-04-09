import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import useSWR from "swr";

const Sold: NextPage = () => {
  const { isLoading } = useSWR("/api/users/me/record?kind=Sales");
  
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
      {isLoading ? <div className="w-full flex justify-center mt-10 text-orange-400 text-2xl font-bold">Loading</div> : <ProductList kind="Purchase" />}

      </div>
    </Layout>
  );
};

export default Sold;
