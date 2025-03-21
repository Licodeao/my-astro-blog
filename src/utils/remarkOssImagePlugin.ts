/**
 * 用于处理 Markdown 中的 OSS 图片的 remark 插件
 */
import { visit } from "unist-util-visit";
import { getSignedUrl } from "./ossClient";

/**
 * remark 插件，用于处理 Markdown 中的图片 URL
 */
export function remarkOssImagePlugin() {
  return (tree) => {
    visit(tree, "image", (node) => {
      if (
        node.url &&
        (node.url.includes("aliyuncs.com") || node.url.includes("oss-cn"))
      ) {
        try {
          const signedUrl = getSignedUrl(node.url, 86400);
          if (signedUrl && signedUrl !== node.url) {
            node.url = signedUrl;
          }
        } catch (error) {
          console.error(`处理图片 ${node.url} 失败:`, error);
        }
      }
    });
  };
}
