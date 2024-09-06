// post request helpers boiler plate

import { requestProps } from "./types";

// env
let API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
let VITE_ENV = import.meta.env.VITE_ENV;

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

  // fetch
  let endpoint = `${API_ENDPOINT}${url}`;
  console.log(endpoint, "endpoint");

  try {
    const req = await fetch(endpoint, {
      mode: "cors",
      method: "POST",
      headers: headers,
      credentials: "include", // Add this line
      body: isFileUpload ? data : JSON.stringify(data),
    });

    if (!req.ok) {
      if (VITE_ENV === "development") {
        console.log(req, "response error");
      }
      throw new Error(`HTTP error! status: ${req.status}`);
    }

    const response = await req.json();
    return { status: req.status, data: response };
  } catch (error) {
    console.error("Error:", error);
    return { status: 400, data: {} };
  }
};


export default postReq;
