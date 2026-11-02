import { requestJson } from "../../../shared/api/client.js";

const authHeaders = (accessToken) => ({ Authorization: `Bearer ${accessToken}` });

export function fetchEnvironments(accessToken) {
  return requestJson("environments/", { headers: authHeaders(accessToken) });
}

export function createEnvironment(accessToken, details) {
  return requestJson("environments/", { method: "POST", headers: authHeaders(accessToken), body: JSON.stringify(details) });
}

export function updateEnvironment(accessToken, id, details) {
  return requestJson(`environments/${id}/`, { method: "PATCH", headers: authHeaders(accessToken), body: JSON.stringify(details) });
}

export function deleteEnvironment(accessToken, id) {
  return requestJson(`environments/${id}/`, { method: "DELETE", headers: authHeaders(accessToken) });
}

export function fetchHistory(accessToken) {
  return requestJson("history/", { headers: authHeaders(accessToken) });
}

export function recordHistory(accessToken, details) {
  return requestJson("history/", { method: "POST", headers: authHeaders(accessToken), body: JSON.stringify(details) });
}
