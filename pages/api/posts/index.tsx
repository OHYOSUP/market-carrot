import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { responseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user },
  } = req;

  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      post,
    });
  }

  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const parsedLatitude = parseFloat(latitude.toString());
    const parsedLongitude = parseFloat(longitude.toString());

    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wondering: true,
            answer: true,
          },
        },
      },
      where: {
        latitude: {
          //gte : grater than equal : 크거나 같다
          gte: parsedLatitude - 0.01,
          //lte : less than equal :  작거나 같다
          lte: parsedLatitude + 0.01,
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }
}

export default withSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
