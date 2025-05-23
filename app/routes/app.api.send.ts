import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const textValue = body.get("text") as string;
  const response = JSON.stringify({
    label: `Ваші дані: "${textValue}" прийнято`,
    value: textValue,
  });
  return new Response(response, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "ngrok-skip-browser-warning",
      "Content-Type": "application/json",
    },
  });
};
