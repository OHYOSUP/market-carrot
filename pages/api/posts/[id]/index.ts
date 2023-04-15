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

  const post = await client?.post.findUnique({
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
      answer: {
        select: {
          answerText: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          answer: true,
          wondering: true,
        },
      },
    },
  });

  const isWondering = Boolean(await client?.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id)
    },
    select: {
      id: true,
    }
  }))

  res.json({
    ok: true,
    post,
    isWondering
  });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
