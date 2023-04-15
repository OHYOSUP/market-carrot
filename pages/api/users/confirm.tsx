import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const { token } = req.body;

  const foundToken = await client?.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!foundToken) return res.status(404).end();
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  // 토큰 사용하면 지우기 => deleteMany
  await client?.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  res.json({
    ok: true,
  });
}
export default withSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
