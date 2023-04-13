import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Chat, ChatRoom, User } from "@prisma/client";

interface ChatRoomWithUser extends ChatRoom {
  chat: Chat[];
  buyer: User;
  seller: User;
}
interface ChatingRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWithUser[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<ChatingRoomResponse>(`/api/chats`);

console.log(data)

  return (
    <Layout pageTitle="당근채팅 | 당근마켓" hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data?.chatRoom.map((chatingRoom) => (
          <Link href={`/chats/${chatingRoom.id}`} key={chatingRoom.id}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              <img
                src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${chatingRoom.seller.avatar}/avatar`}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
              <div>
                <p className="text-gray-700">{chatingRoom.seller.name}</p>
                <p className="text-sm  text-gray-500">{chatingRoom.chat}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
