const API_BASE_URL = "http://103.151.63.84:8008/api";

async function requestAPI(endpoint, method = "GET", bodyData = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const options = {
    method: method,
    headers: headers,
  };

  if (bodyData) {
    options.body = JSON.stringify(bodyData);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json().catch(() => null);

  return {
    status: response.status,
    ok: response.ok,
    data: data,
  };
}