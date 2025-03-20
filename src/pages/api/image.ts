import { getSignedUrl } from "../../utils/ossClient";

export async function POST({ request }) {
  try {
    // 从请求体获取数据
    const data = await request.json();
    const imageUrl = data.url;

    if (!imageUrl) {
      console.error("缺少 url 参数");
      return new Response(
        JSON.stringify({
          error: "缺少 url 参数",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 尝试生成签名URL，如果失败则使用原始URL
    let signedUrl;
    try {
      signedUrl = getSignedUrl(imageUrl, 86400);
    } catch (error) {
      console.error("生成签名URL失败:", error);
      signedUrl = imageUrl; // 降级使用原始URL
    }

    return new Response(
      JSON.stringify({
        original: imageUrl,
        signed: signedUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API 错误:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
