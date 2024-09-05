// post request helpers boiler plate

import { requestProps } from "./types";


// env
let VITE_APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const postReq = async ({ url, data, isFileUpload, extras }: requestProps) => {
  // headers
  let headers = new Headers();
  !isFileUpload && headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("authorisation", "Bearer ");
  if (extras) {
    for (let e = 0; e < extras.length; e++) {
      const element = extras[e];
      headers.append(element.key, element.value);
    }
  }

  try {
    const req = await fetch(`${VITE_APP_DOMAIN}${url}`, {
      method: "POST",
      headers: headers,
      body: isFileUpload ? data : JSON.stringify(data),
    });

    const response = await req.json();
    return { status: req.status, data: response };
  } catch (error) {
    console.error("Error:", error);
    return { status: 400, data: {} };
  }
};

export default postReq;
