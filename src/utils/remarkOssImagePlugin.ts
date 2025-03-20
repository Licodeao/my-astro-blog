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
      console.log("node", node);
      // 检查是否是 OSS 图片
      if (
        node.url &&
        (node.url.includes("aliyuncs.com") || node.url.includes("oss-cn"))
      ) {
        // 在构建时替换为签名 URL
        node.url = getSignedUrl(node.url, 86400); // 24小时有效期
      }
    });
  };
}
