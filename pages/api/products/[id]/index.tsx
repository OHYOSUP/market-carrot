import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
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

  const relatedItems = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.record.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
        kind: "Fav"
      },
      select: {
        id: true,
      },
    })
  );

  res.json({
    ok: true,
    product,
    relatedItems,
    isLiked,
  });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
