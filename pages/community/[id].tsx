import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
import answer from "pages/api/posts/[id]/answer";

interface AnswerWithUser extends Answer {
  user: User;
}
interface PostWithUser extends Post {
  user: User;
  _count: {
    answer: number;
    wondering: number;
  };
  answer: AnswerWithUser[];
}
interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface IAnswerForm {
  reply: string;
}

interface AnswerResponse {
  ok: boolean;
  answer: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const onWonderingClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wondering: data.isWondering
              ? data?.post._count.wondering - 1
              : data?.post._count.wondering + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    if (!loading) {
      wonder({});
    }
  };

  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answer`);
  const { register, handleSubmit, reset } = useForm<IAnswerForm>();

  const onValid = (data: IAnswerForm) => {
    if (answerLoading) return;
    sendAnswer(data);
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, mutate, reset]);

  const { user } = useUser();

  
  return (
    <Layout
      title={`${data?.post.question.slice(0, 5)}... | 동네생활`}
      canGoBack
    >
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          {user?.avatar ? (
            <img
              src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${user.avatar}/avatar`}
              className="w-16 h-16 bg-slate-500 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.post.user.name}
            </p>
            <Link legacyBehavior href={`/users.post/${data?.post.user.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span>
            {data?.post.question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button
              onClick={onWonderingClick}
              className={cls(
                "flex space-x-2 items-center text-sm cursor-pointer",
                data?.isWondering ? "text-orange-400" : ""
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.post._count.wondering}</span>
            </button>
            <span className="flex space-x-2 items-center text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post._count.answer}</span>
            </span>
          </div>
        </div>
        {data?.post.answer.map((answer) => (
          <div key={answer.id} className="px-4 my-5 space-y-5">
            <div className="flex items-start space-x-3">
              {user?.avatar ? (
                <img
                  src={`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${user.avatar}/avatar`}
                  className="w-10 h-10 bg-slate-500 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-300" />
              )}
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="text-xs text-gray-500 block ">
                  {answer.createdAt}
                </span>
                <p className="text-gray-700 mt-2">{answer.answerText}</p>
              </div>
            </div>
          </div>
        ))}
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register("reply", { required: true, minLength: 5 })}
            name="description"
            placeholder="우리 동네에 대해 물어보세요!"
            required
          />
          <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
            {answerLoading ? "업로드 중입니다" : "답변하기"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
