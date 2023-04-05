import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    session: { user },
    query: { kind: kindGuide },
  } = req;
  const kind = kindGuide as Kind;

  const records = await client.record.findMany({
    where: {
      kind: kind,
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              records: true
            }
          }
        }
      }
    }
  });

  res.json({
    ok: true,
    records,
  });
}

export default withSession(withHandler({ methods: ["GET"], handler }));
