import React from "react";
import type { CollectionEntry } from "astro:content";

export default (article: CollectionEntry<"articles">) => {
  return (
    <div>
      <h1>{article.data.title}</h1>
      <p>{article.data.description}</p>
    </div>
  );
};
