// post request helpers boiler plate
// env
let REACT_APP_DOMAIN = "http://localhost:5000/";
let VITE_ENV = import.meta.env.VITE_ENV;

const postReq = async (data, url, isFileUpload = false) => {
  // headers
  let headers = new Headers();
  !isFileUpload && headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  // fetch
  let endpoint = `${REACT_APP_DOMAIN}${url}`;

  try {
    const req = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: isFileUpload ? data : JSON.stringify(data),
    });

    if (req.status === 400) {
      return await req.json();
    }

    if (!req.ok) {
      if (VITE_ENV === "development") {
        console.log(req, "response error");
      }
      throw new Error(`HTTP error! status: ${req.status}`);
    }

    const serverRes = await req.json();
    return serverRes;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default postReq;
