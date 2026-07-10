import apiClient from "./apiClient";

function getSessionId() {
  let id = localStorage.getItem("sp_session_id");
  if (!id) {
    id = "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("sp_session_id", id);
  }
  return id;
}

// Best-effort page-type/entity detection from the current path, so top
// properties/blogs can be aggregated on the dashboard.
function detectPage(pathname) {
  if (pathname === "/") return { page_type: "home" };

  const propertyMatch = pathname.match(/^\/property\/(\d+)/);
  if (propertyMatch) return { page_type: "property", entity_id: Number(propertyMatch[1]) };

  const blogMatch = pathname.match(/^\/blog\/(?!category\/|tag\/)([^/]+)/);
  if (blogMatch) return { page_type: "blog" };

  return { page_type: "page" };
}

export function trackPageView(pathname, entityTitle = null) {
  const { page_type, entity_id } = detectPage(pathname);

  apiClient.post("track-visit", {
    session_id: getSessionId(),
    page_url: pathname,
    page_type,
    entity_id: entity_id || null,
    entity_title: entityTitle,
    referrer: document.referrer || null,
  }).catch(() => {});
}

// For pages like blog posts where the URL uses a slug, not a numeric id —
// the real id/title only become known after the API response arrives.
export function trackPageViewWithEntity(pathname, entityId, entityTitle = null) {
  const { page_type } = detectPage(pathname);

  apiClient.post("track-visit", {
    session_id: getSessionId(),
    page_url: pathname,
    page_type,
    entity_id: entityId || null,
    entity_title: entityTitle,
    referrer: document.referrer || null,
  }).catch(() => {});
}

export function startHeartbeat() {
  const ping = () => {
    apiClient.post("track-heartbeat", { session_id: getSessionId() }).catch(() => {});
  };
  ping();
  return setInterval(ping, 20000);
}