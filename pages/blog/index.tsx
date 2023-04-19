import Layout from "@components/layout";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Posts {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Posts[] }> = ({ posts }) => {
  return (
    <Layout pageTitle="블로그">
      <h1 className="font-semibold text-lg">최근 게시물</h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5">
            <Link legacyBehavior href={`/blog/${post.slug}`}>
              <a>
                <span className="text-lg text-red-500">{post.title}</span>
                <div>
                  <span>
                    {post.date} / {post.category}
                  </span>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // readdirSync = 디렉토리를 읽을 수 있게 해준다.
  // readdirSync는 페이지를 호출 할 때 pages기준이므로 ../가 아니라 ./가 와야한다
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    // gray-matter : front-matter를 객체형태로 파싱해주는 라이브러리
    return { ...matter(content).data, slug };
  });

  return {
    props: {
      posts: blogPosts.reverse(),
    },
  };
};
export default Blog;
