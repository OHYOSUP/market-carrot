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

  const chatRoom = await client.chatRoom.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      Chat: {
        select: {
          message: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })


  res.json({
    ok: true,
    chatRoom
  });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
