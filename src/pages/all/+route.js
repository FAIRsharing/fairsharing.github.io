export default function route(pageContext) {
  const path = pageContext.urlPathname;

  // 1. If Vike is looking for its internal data assets, skip the catch-all
  if (path.includes(".pageContext.json") || path.startsWith("/@vike/")) {
    return false;
  }

  // 2. Otherwise, match the route and pass it to your Vue app shell
  return {
    match: true,
  };
}
