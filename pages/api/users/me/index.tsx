import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { withSession } from "@libs/server/withSession";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });

  // 쿠키는 매번 서버로 요청하기 때문에 api url이 새로고침될때마다 console에 찍힌다
  // console.log(req.session.user);
  res.json({
    ok: true,
    profile,
  });
}

export default withSession(
  withHandler({ methods: ["GET"], handler })
);
