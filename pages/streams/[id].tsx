import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Message from "@components/message";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar: string;
    id: number;
  };
}

interface StreamWithMessage extends Stream {
  message: StreamMessage[];
}

interface StreamResponse {
  ok: boolean;
  streams: StreamWithMessage;
}

interface MessageForm {
  message: string;
}

const Stream: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const { register, reset, handleSubmit } = useForm<MessageForm>();
  const [sendMessage, { loading, data: messageData }] = useMutation(
    `/api/streams/${router.query.id}/message`
  );

  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev && {
          ...prev,
          streams: {
            ...prev.streams,
            message: [
              ...prev.streams.message,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        },
      false
    );
    sendMessage(form);
  };

  return (
    <Layout title={`${data?.streams.name}`} pageTitle={`${data?.streams.name} | 당근 라이브`} canGoBack>
      <div className="py-10 px-4  space-y-4">
        {data?.streams.cloudflareId ? <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video">
          <iframe
            src={`https://iframe.videodelivery.net/${data?.streams.cloudflareId}`}
            className="w-full aspect-video rounded"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        </div> : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.streams?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data?.streams?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.streams?.description}</p>
          <div className="flex flex-col bg-orange-300 rounded-md p-3 overflow-scroll">
            <strong>Stream Keys</strong>
            <span>
              URL : <strong>{data?.streams.cloudflareUrl}</strong>
            </span>
            <span>
              Keys : <strong>{data?.streams.cloudflareKey}</strong>
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll scrollbar-hide px-4 space-y-4">
            {data?.streams.message.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center w-full mx-auto"
            >
              <input
                {...register("message")}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stream;
