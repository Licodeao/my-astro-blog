/**
 * 阿里云 OSS 图片 URL 处理工具
 * @fileoverview 用于生成私有 Bucket 中图片的签名 URL
 */
import OSS from "ali-oss";

// OSS 客户端实例缓存
let ossClient: OSS | null = null;

/**
 * 获取 OSS 客户端实例
 * @returns OSS 客户端
 */
function getOssClient() {
  if (!ossClient) {
    ossClient = new OSS({
      region: import.meta.env.OSS_REGION,
      accessKeyId: import.meta.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: import.meta.env.OSS_ACCESS_KEY_SECRET,
      bucket: import.meta.env.OSS_BUCKET_NAME,
      secure: true, // 使用 HTTPS
    });
  }
  return ossClient;
}

/**
 * 将 OSS 对象路径转换为签名 URL
 * @param url 原始 URL 或对象路径
 * @param expires 过期时间（秒）
 * @returns 签名后的 URL
 */
export function getSignedImageUrl(url: string, expires = 3600) {
  // 如果不是 OSS URL，直接返回原始 URL
  if (!url || !url.includes(import.meta.env.OSS_BUCKET_NAME)) {
    return url;
  }

  try {
    const client = getOssClient();

    // 从 URL 中提取对象名称
    let objectName = url;

    // 如果是完整 URL，提取路径部分
    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      objectName = urlObj.pathname;
      // 移除开头的斜杠
      if (objectName.startsWith("/")) {
        objectName = objectName.substring(1);
      }
    }

    // 生成签名 URL
    return client.signatureUrl(objectName, { expires });
  } catch (error) {
    console.error("生成签名 URL 失败:", error);
    // 出错时返回原始 URL
    return url;
  }
}
