import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    session: { user },
    body: { name, price, description },
    query: { page },
  } = req;

  if (req.method === "POST") {
    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds":10 }}`,
        }
      )
    ).json();

    const stream = await client?.stream.create({
      data: {
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        name,
        price: Number(price),
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      stream,
    });
  }
  if (req.method === "GET") {
    const streamCount = await client?.stream.count();
    const streams = await client?.stream.findMany({
      take: 10,
      skip: (+page - 1) * 10,
    });
    res.json({
      ok: true,
      streams,
      pages: streamCount && Math.ceil(streamCount / 10),
    });
  }
}

export default withSession(withHandler({ methods: ["GET", "POST"], handler }));
