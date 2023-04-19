import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import useSWR from "swr";


const Loved: NextPage = () => {
  const {data, isLoading } = useSWR("/api/users/me/record?kind=Fav");

  return (
    <Layout title="관심목록" pageTitle="관심목록 | 당근마켓" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
      {isLoading ? <div className="w-full flex justify-center mt-10 text-orange-400 text-2xl font-bold">Loading</div> : <ProductList kind="Fav" />}
      </div>
    </Layout>
  );
};

export default Loved;
