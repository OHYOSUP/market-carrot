import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { Chat, ChatRoom, User } from "@prisma/client";
import useSWR from "swr";
import useUser from "@libs/client/useUser";

interface MesageWithUser extends Chat {
  user: User;
}
interface ChatRoomWithMessage extends ChatRoom {
  Chat: MesageWithUser[];
  buyer: User;
  seller: User;
}
interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWithMessage;
}

interface ChatForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const { register, handleSubmit, setValue } = useForm<ChatForm>();
  const router = useRouter();
  const [chatEnter, { data, loading }] = useMutation(
    `/api/chats/${router.query.id}/message`
  );


  const { data: chatRoomData, mutate } = useSWR<ChatRoomResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );

  const { user } = useUser();

  const onValid = (message: ChatForm) => {
    chatEnter(message);
    mutate(prev=> prev&& ({
      ...prev,
      chatRoom:{
        ...prev.chatRoom,
        Chat:[
          ...prev.chatRoom.Chat,
         {
          id: Date.now(),
          createdAt: prev.chatRoom.createdAt,
          updatedAt: prev.chatRoom.updatedAt,
          message: message.message,
          userId: user.id,
          chatRoomId: prev.chatRoom.id,
          user:{
            ...user
          }
         }
        ]
      }
    }),false)
    setValue("message", "");
  };
console.log(chatRoomData?.chatRoom.buyerId)
  const whoIs =
    chatRoomData?.chatRoom.buyerId !== user?.id
      ? {
          name: chatRoomData?.chatRoom.buyer.name,
          id: chatRoomData?.chatRoom.buyer.id,
          avatar: chatRoomData?.chatRoom.buyer.avatar,
        }
      : {
          name: chatRoomData?.chatRoom.seller.name,
          id: chatRoomData?.chatRoom.seller.id,
          avatar: chatRoomData?.chatRoom.seller.avatar,
        };

  
  return (
    <Layout pageTitle="" canGoBack title={whoIs.name}>
      <div className="py-10 pb-16 px-4 space-y-4">
      {chatRoomData?.chatRoom.Chat.map(message=>(
        <Message message={message.message} key={message.id} reversed={message.user.id === (user?.id)} avatarUrl={whoIs.avatar+""}/>
      ))}
        {/* <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" /> */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed py-2 bg-white  bottom-0 inset-x-0"
        >
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              {...register("message", { required: true })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
