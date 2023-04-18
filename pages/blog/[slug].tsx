import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import matter from "gray-matter";
import { unified } from "unified";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import Layout from "@components/layout";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout
      pageTitle={`블로그 ${data.title}`}
      title={`${data.title}`}
      canGoBack
    >
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post }}
      ></div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

// [slug]를 받아서 matter라이브러리를 이용해서 파일을 읽고 마크다운 데이터를 remarkHml, remarkParse를 이용해 html로 파싱했다
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  // 마크다운 데이터를 html로 파싱해주느 라이브러리
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  

  return {
    props: {
      data,
      post: value,
    },
  };
};

export default Post;
