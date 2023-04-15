import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  if (req.method === "POST") {
    const {
      query: { sellerId, productId },
      session: { user },
    } = req;

    const existingChatingRoom = await client?.chatRoom.findFirst({
      where: {
        productId: Number(productId),
        buyerId: user?.id,
        sellerId: Number(sellerId),
      },
    });

    if (existingChatingRoom) {
      res.json({
        ok: true,
        chatingRoomId: existingChatingRoom.id,
      });
    } else {
      const createChatingRoom = await client?.chatRoom.create({
        data: {
          product: {
            connect: {
              id: Number(productId),
            },
          },
          buyer: {
            connect: {
              id: user?.id,
            },
          },
          seller: {
            connect: {
              id: Number(sellerId),
            },
          },
        },
      });
      res.json({
        ok: true,
        createChatingRoom,
      });
    }
  }

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const chatRoom = await client?.chatRoom.findMany({
      where: {
        OR: [{ sellerId: user?.id }, { buyerId: user?.id }],
      },
      include: {
        buyer: {
          select: {
            name: true,
            avatar: true,
            id: true,
          },
        },

        seller: {
          select: {
            name: true,
            avatar: true,
            id: true,
          },
        },
        Chat: {
          select: {
            message: true,
            createdAt: true,
            id: true
          },
          orderBy: {
            createdAt: 'desc'
          },
        },
      },
    });

    res.json({
      ok: true,
      chatRoom
    })
  }
}

export default withSession(withHandler({ methods: ["GET", "POST"], handler }));
