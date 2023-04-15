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

  const alreadyExists = await client?.record.findFirst({
    where: {
      kind: "Fav",
      userId: user?.id,
      productId: Number(id),
    },
  });

  if (alreadyExists) {
    await client?.record.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client?.record.create({
      data: {
        kind: "Fav",
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withSession(withHandler({ methods: ["POST"], handler }));
