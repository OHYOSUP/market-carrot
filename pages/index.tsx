import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import Head from "next/head";
import client from "@libs/server/client";

export interface favCountState extends Product {
  _count: {
    records: number;
  };
}
interface UploadProductForm {
  ok: boolean;
  products: favCountState[];
}

const Home: NextPage = () => {
  const { data } = useSWR<UploadProductForm>("/api/products");
  
  return (
    <Layout title="당근마켓" pageTitle="홈 | 당근마켓" hasTabBar>       
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product?._count?.records}
            imageURL={product.image}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

 const Page: NextPage<{products: favCountState[]}> = ({products})=>{
  return(
    <SWRConfig value={{
      fallback:{
        "/api/products": {
          ok: true,
          products,
        }
      }
    }}>
      <Home />
    </SWRConfig>
  )
 }
export async function getServerSideProps() {
  const products = await client?.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
export default Page;
