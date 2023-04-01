import { NextApiRequest, NextApiResponse } from "next";

export interface responseType {
  ok: boolean;
  [key: string]: any;
}

type method = "POST" | "GET" | "DELETE"

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      res.status(401).json({
        ok: false,
        error: "로그인해주세요",
      });
    }
    try {
      await handler(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err });
    }
  };
}
