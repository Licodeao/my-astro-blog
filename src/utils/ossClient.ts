import OSS from "ali-oss";

/**
 * 阿里云 OSS 客户端实例
 */
let client: OSS | null = null;

/**
 * 检查 OSS 环境变量是否配置
 * @returns 是否配置了所有必需的环境变量
 */
function checkOssEnv() {
  const required = [
    "OSS_REGION",
    "OSS_ACCESS_KEY_ID",
    "OSS_ACCESS_KEY_SECRET",
    "OSS_BUCKET_NAME",
  ];

  // 判断是否在浏览器环境
  const isBrowser = typeof window !== "undefined";

  // 如果是浏览器环境，跳过环境变量检查，依赖客户端脚本
  if (isBrowser) {
    return true;
  }

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    // 构建时只显示警告，不阻止构建
    console.warn(`OSS 配置提示: 构建时缺少环境变量 ${missing.join(", ")}`);
    return false;
  }

  return true;
}

/**
 * 获取 OSS 客户端实例
 * @returns OSS 客户端
 */
export function getOssClient() {
  // 如果客户端已经存在，直接返回
  if (client) {
    return client;
  }

  // 检查环境变量
  if (!checkOssEnv()) {
    // 如果环境变量不完整，返回 null（而不是抛出错误）
    console.error("无法创建 OSS 客户端：环境变量不完整");
    return null;
  }

  try {
    client = new OSS({
      region: import.meta.env.OSS_REGION,
      accessKeyId: import.meta.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: import.meta.env.OSS_ACCESS_KEY_SECRET,
      bucket: import.meta.env.OSS_BUCKET_NAME,
      secure: true, // 使用 HTTPS
      authorizationV4: true,
    });

    return client;
  } catch (error) {
    console.error("创建 OSS 客户端失败:", error);
    return null;
  }
}

/**
 * 生成 OSS 对象的签名 URL
 * @param {string} url - 原始 URL
 * @param {number} expires - 过期时间（秒）
 * @returns {string} 签名后的 URL
 */
export function getSignedUrl(url: string, expires = 3600) {
  try {
    // 如果不是 OSS URL，直接返回
    if (!url || (!url.includes("aliyuncs.com") && !url.includes("oss-cn"))) {
      return url;
    }

    const client = getOssClient();

    // 如果客户端创建失败，直接返回原始 URL
    if (!client) {
      console.warn("未能创建 OSS 客户端，返回原始 URL");
      return url;
    }

    // 从 URL 中提取对象路径
    let objectPath = url;

    // 如果是完整 URL，提取对象路径
    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      objectPath = urlObj.pathname;

      // 移除开头的斜杠
      if (objectPath.startsWith("/")) {
        objectPath = objectPath.substring(1);
      }

      // 如果域名包含 bucket 名称，可能需要进一步处理路径
      const bucket = import.meta.env.OSS_BUCKET_NAME;
      if (urlObj.hostname.includes(bucket)) {
        // 提取子路径
        const parts = urlObj.hostname.split(".");
        if (parts[0] === bucket) {
          // URL 格式: bucket.oss-cn-region.aliyuncs.com/path/to/object
          // 不需要额外处理
        }
      }
    }

    // 生成签名 URL
    const signedUrl = client.signatureUrl(objectPath, { expires });
    return signedUrl;
  } catch (error) {
    console.error("生成签名 URL 失败:", error);
    // 出错时返回原始 URL
    return url;
  }
}
