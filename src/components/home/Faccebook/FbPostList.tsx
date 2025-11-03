"use client";
import FbPostCard, { FbPost } from "./FbPostCard";

type FbResponse = { data: FbPost[] };

export default function FbPostList({ initial }: { initial: FbResponse }) {
  const posts = initial.data || [];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <FbPostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
