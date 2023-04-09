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
  } = req;

  const streams = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      message: {
        select: {
          message: true,
          id: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  res.json({
    ok: true,
    streams,
  });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
