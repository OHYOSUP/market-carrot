import { favCountState } from "pages";
import useSWR from "swr";
import Item from "./item";
import { Product, Record } from "@prisma/client";

interface ProductListProps {
  kind: "Fav" | "Sales" | "Purchase";
}
interface ProductwithCount extends Product {
  _count: {
    records: number;
  };
}

interface RecordwithProduct extends Record {
  product: ProductwithCount;
}

export interface RecordResponsse {
  ok: boolean;
  records: RecordwithProduct[];
}
export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<RecordResponsse>(`/api/users/me/record?kind=${kind}`);
  
  return data ? (
    <>
      {data.records?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          imageURL={record.product.image}
          hearts={record.product._count.records}
        />
      ))}
    </>
  ) : null;
}
