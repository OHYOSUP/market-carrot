import client from "@libs/server/client";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY!);
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const { email, phone } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  if (!user) return res.status(400).json({ ok: false });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   // undefined는 to에 들어갈 수 없으니 ! 을 붙여서 반드시 존재하는 데이터라고 타입스크립트에게 알려준다
    //   to: process.env.MY_PHONE!,
    //   body: `인증번호는 ${payload} 입니다.`,
    // });
    // console.log(message)
  } else if (email) {
    // const email = await mail.send({
    //   from: "gonnaflyyeah@naver.com",
    //   to: "gonnaflyyeah@naver.com",
    //   subject: "아래 인증키를 입력하세요",
    //   text: `인증번호는 ${payload}`,
    //   html: `<strong>인증번호는 ${payload}</strong>`
    // })
    // console.log(email)
  }
  const token = await client.token.create({
    data: {
      payload,
      user: {
        // connect : 기존의 user와 연결
        // create: 새로운 user를 만들어서 token생성
        // cooenctOrCreate: 기존의 user를 찾아서 있으면 connect, 없으면 create
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Annonymous",
            ...user,
          },
        },
      },
    },
  });
  

  return res.json({ ok: true, token });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false 
});
