import { useRouter } from "next/router";
import * as React from "react";

export interface ParamaProps {}

export default function Parama(props: ParamaProps) {
  const router = useRouter();
  return (
    <div>
      <h1> para page</h1>
      <h2> Query : {JSON.stringify(router.query)}</h2>
    </div>
  );
}
