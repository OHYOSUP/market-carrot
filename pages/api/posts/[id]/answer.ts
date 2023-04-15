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
    body: { reply },
  } = req;

  const post = await client?.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });

  const newAnswer = await client?.answer.create({
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
      answerText: reply,
    },
  });

  console.log(newAnswer)
  console.log(post)
  res.json({
    ok: true,
    newAnswer,
  });
}

export default withSession(withHandler({ methods: ["POST"], handler }));
