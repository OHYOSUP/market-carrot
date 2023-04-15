import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { responseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExists = await client?.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id),
    },
    select: {
      id: true,
    },
  });
  if (alreadyExists) {
    await client?.wondering.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client?.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
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

export default withSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);