import { env } from "~/env";

export async function fetchData(url: string): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export async function postData({
  url,
  payload,
}: {
  url: string;
  payload: any;
}): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to post data");
  }
  return res.json();
}

export async function deleteMethod({
  url,
  payload,
}: {
  url: string;
  payload: { id: string };
}): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
  return res.json();
}

export async function deleteData(url: string): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
  return res.json();
}

export async function patchData({
  url,
  payload,
}: {
  url: string;
  payload: any;
}): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  console.log("patchData", { url, payload });

  const res = await fetch(`${baseUrl}${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to patch data");
  }

  return res.json();
}

export async function putData({
  url,
  payload,
}: {
  url: string;
  payload: any;
}): Promise<unknown> {
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to put data");
  }
  return res.json();
}
