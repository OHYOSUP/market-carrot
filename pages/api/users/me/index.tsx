import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  if (req.method === "GET") {
    const profile = await client?.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req;
    
    const currentUser = await client?.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email ) {
      const alreadyExistt = Boolean(
        await client?.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExistt) {
        return res.json({
          ok: false,
          error: "이미 존재하는 이메일입니다.",
        });
      }
      await client?.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      res.json({
        ok: true,
      });
    }
    if (phone && phone !== currentUser?.phone ) {
      const alreadyExistt = Boolean(
        await client?.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExistt) {
        return res.json({
          ok: false,
          error: "이미 존재하는 번호입니다.",
        });
      }
      await client?.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      res.json({
        ok: true,
      });
    }
    if (name) {
      await client?.user.update({
        where: {
          id: user?.id,
        },
        data: { name },
      });
    } 

    if(avatarId){
      await client?.user.update({
        where:{
          id: user?.id
        },
        data:{
          avatar: avatarId,
        }
      })
    }
    res.json({
      ok: true,
    });
  }
}

export default withSession(withHandler({ methods: ["GET", "POST"], handler }));
