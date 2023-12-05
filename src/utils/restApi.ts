import { METHOD } from 'global';

export const replacePlaceholder = (
  s: string,
  data: Record<string, unknown>,
) => {
  const parts = s.split(/{(.*?)}/g).map(v => {
    const replaced = v.replace(/{/g, '');
    if (data instanceof FormData) {
      return data.get(replaced) || replaced;
    }
    return data[replaced] || replaced;
  });

  return parts.join('');
};

export const fetcher = async (
  url: string,
  method: METHOD,
  body?: Record<string, unknown> | FormData,
  headers?: HeadersInit,
) => {
  let parsedUri = `${process.env.BASE_API_URL ?? ''}${url}${
    method === METHOD.GET && body
      ? `?${new URLSearchParams(body as unknown as Record<string, string>)}`
      : ''
  }`;
  parsedUri = replacePlaceholder(
    parsedUri,
    (body as unknown as Record<string, unknown>) || {},
  );
  const res = await fetch(parsedUri, {
    method,
    headers: {
      ...headers,
      ...(!(body instanceof FormData) && {
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    },
    ...(method !== METHOD.GET && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
