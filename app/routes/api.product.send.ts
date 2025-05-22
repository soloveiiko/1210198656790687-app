import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const body = JSON.stringify({ simple_text: "Оновлений текст з API" });

  return new Response(body, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "ngrok-skip-browser-warning",
      "Content-Type": "application/json",
    },
  });
};
