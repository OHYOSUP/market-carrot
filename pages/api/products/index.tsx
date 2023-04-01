import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    body: { name, price, description },
    session: { user },
  } = req;

  if(req.method === "POST"){
    const product = await client.product.create({
      data:{
        name,
        image: "xx",      
        price : Number(price),
        description,
        user:{
          connect:{
            id: user?.id
          }
        }      
      }
    })

    res.json({
      ok: true,
      product
    });
  }
  if(req.method === "GET"){
    const products = await client.product.findMany({
      include:{
        _count:{
          select:{
            fav: true
          }
        }
      }
    })

    res.json({
      ok: true,
      products
    })
  }
}

export default withSession(withHandler({ methods: ["POST", "GET"], handler }));
