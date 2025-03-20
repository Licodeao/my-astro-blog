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
      // 检查是否是 OSS 图片
      if (
        node.url &&
        (node.url.includes("aliyuncs.com") || node.url.includes("oss-cn"))
      ) {
        try {
          // 在构建时替换为签名 URL
          const signedUrl = getSignedUrl(node.url, 86400); // 24小时有效期
          // 只有在成功获取签名 URL 时才替换
          if (signedUrl && signedUrl !== node.url) {
            node.url = signedUrl;
          }
        } catch (error) {
          // 发生错误时记录日志但不中断构建过程
          console.error(`处理图片 ${node.url} 失败:`, error);
        }
      }
    });
  };
}
