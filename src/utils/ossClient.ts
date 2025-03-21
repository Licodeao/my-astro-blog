import OSS from "ali-oss";

/**
 * 阿里云 OSS 客户端实例
 */
let client: OSS | null = null;

/**
 * 获取环境变量
 * @param {string} key - 环境变量名
 * @returns {string|undefined} - 环境变量值
 */
function getEnvVar(key) {
  if (process.env && process.env[key]) {
    return process.env[key];
  }

  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }

  return undefined;
}

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

  const missing = required.filter((key) => !getEnvVar(key));

  if (missing.length > 0) {
    console.error(`OSS 配置错误: 缺少环境变量 ${missing.join(", ")}`);
    return false;
  }

  return true;
}

/**
 * 获取 OSS 客户端实例
 * @returns OSS 客户端
 */
export function getOssClient() {
  if (client) {
    return client;
  }

  if (!checkOssEnv()) {
    console.error("无法创建 OSS 客户端：环境变量不完整");
    return null;
  }

  try {
    client = new OSS({
      region: getEnvVar("OSS_REGION"),
      accessKeyId: getEnvVar("OSS_ACCESS_KEY_ID"),
      accessKeySecret: getEnvVar("OSS_ACCESS_KEY_SECRET"),
      bucket: getEnvVar("OSS_BUCKET_NAME"),
      secure: true,
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
    if (!url || (!url.includes("aliyuncs.com") && !url.includes("oss-cn"))) {
      return url;
    }

    const client = getOssClient();

    if (!client) {
      console.warn("未能创建 OSS 客户端，返回原始 URL");
      return url;
    }

    let objectPath = url;

    if (url.startsWith("http")) {
      const urlObj = new URL(url);
      objectPath = urlObj.pathname;

      if (objectPath.startsWith("/")) {
        objectPath = objectPath.substring(1);
      }

      const bucket = import.meta.env.OSS_BUCKET_NAME;
      if (urlObj.hostname.includes(bucket)) {
        const parts = urlObj.hostname.split(".");
        if (parts[0] === bucket) {
        }
      }
    }

    const signedUrl = client.signatureUrl(objectPath, { expires });
    return signedUrl;
  } catch (error) {
    console.error("生成签名 URL 失败:", error);
    return url;
  }
}
