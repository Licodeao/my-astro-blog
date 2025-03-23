import { getSignedUrl } from "../../utils/ossClient";

export async function POST({ request }) {
  try {
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

    const signedUrl = getSignedUrl(imageUrl, 604800);

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
