import Layout from "@components/layout";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface Posts {
  title: string;
  date: string;
  category: string;
}

const Blog: NextPage<{ posts: Posts[] }> = ({ posts }) => {
  return (
    <Layout pageTitle="블로그">
      <h1 className="font-semibold text-lg">최근 게시물</h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-5">
            <span className="text-lg text-red-300">{post.title}</span>
            <div>
              <span>{post.date} / {post.category}</span>              
            </div>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    return matter(content).data;
  });
  console.log(blogPosts);
  return {
    props: {
      posts: blogPosts,
    },
  };
}
export default Blog;
