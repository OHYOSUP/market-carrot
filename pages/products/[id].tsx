import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { useEffect } from "react";
import client from "@libs/server/client";

interface productWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: productWithUser;
  relatedItems: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedItems,
  isLiked,
}) => {
  const router = useRouter();

  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toogleFav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );

  const onFavClick = () => {
    toogleFav({});
    if (!data) return;
    if (!loading) {
      mutate({ ...data, isLiked: !data.isLiked }, false);
    }
  };

  const [
    createChatingRoom,
    { data: chatingRoomData, loading: chatingRoomLoading },
  ] = useMutation(
    `/api/chats?sellerId=${data?.product.userId}&productId=${data?.product.id}`
  );

  const onClickChatingRoom = () => {
    if (chatingRoomLoading) return;
    createChatingRoom({});
  };

  useEffect(() => {
    if (chatingRoomLoading) return;
    if (chatingRoomData && chatingRoomData.ok) {
      router.push(
        router.query.id ? `/chats/${chatingRoomData.chatingRoomId}` : ""
      );
    }
  }, [router, chatingRoomData, chatingRoomLoading]);

  return (
    <Layout
      title={`${product.name}`}
      pageTitle={`${product.name} | 당근마켓`}
      canGoBack
    >
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-9">
            <img
              alt="product image"
              // layout="fill"
              src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${product?.image}/product`}
              className="bg-slate-300 object-cover"
            />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {product?.user?.avatar ? (
              <img
                alt="avatar of seller"
                width={48}
                height={48}
                src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${product?.user.avatar}/avatar`}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <Link legacyBehavior href={`/users.profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ₩{product.price}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="대화하기" onClick={onClickChatingRoom} />
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  isLiked ? "text-red-400  hover:text-red-500" : ""
                )}
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedItems?.map((product) => (
              <div key={product.id}>
                <Link legacyBehavior href={`/products/${product.id}`}>
                  <a>
                    <img
                      width={200}
                      height={200}
                      alt="related product image"
                      src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${product.image}/product`}
                      className="h-56 w-full mb-4 bg-slate-300"
                    />
                    <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </span>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    // 유저가 getStatocProps나 getStaticPaths를 방문할 때 만약 그페이지에 해당하는 html이 없다면 유저가 잠시동안 기다리게 만들고
    // fallback blocking이 그동안 백그라운드에서 페이지를 만들어서 유저에게 넘겨준다
    // falback: "true" => 유저에게 보여주고 싶은 무언가를 보여주고 html이 준비되면 그 페이지로 바꿔준다.
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client?.product.findUnique({
    where: {
      id: Number(ctx?.params?.id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((item) => ({
    name: {
      contains: item,
    },
  }));

  const relatedItems = await client?.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isLiked = false;

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedItems: JSON.parse(JSON.stringify(relatedItems)),
      isLiked,
    },
  };
};

export default ItemDetail;
