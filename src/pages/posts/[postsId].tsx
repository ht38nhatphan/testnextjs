import { useRouter } from "next/router";
import * as React from "react";

export interface PostDetailProps {}

export default function PostDetail(props: PostDetailProps) {
  const router = useRouter();
  return (
    <div>
      <h1> Post detail page</h1>
      <h2> Query : {JSON.stringify(router.query)}</h2>
    </div>
  );
}
