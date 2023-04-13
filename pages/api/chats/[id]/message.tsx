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
    body: { message },
  } = req;
  const chatmessage = await client.chat.create({
    data:{
      message,
      user:{
        connect:{
          id: user?.id
        }
      },
      chatRoom:{
        connect:{
          id: Number(id)
        }
      }
    }
  })

  res.json({
    ok: true,
    chatmessage
  });
}

export default withSession(withHandler({ methods: ["POST"], handler }));
