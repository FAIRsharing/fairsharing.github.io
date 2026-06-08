// src/pages/+route.js

export default function route(pageContext) {
  const path = pageContext.urlPathname;

  // 1. Safely ignore all Vike system paths, asset directories, and static files
  if (
    path.includes('.pageContext.json') ||
        path.startsWith('/@vike/') ||
        path.startsWith('/assets/') ||
        path.includes('.') // Catches file extensions (.js, .css) AND build hashes like /FAIRsharing.ps501f
  ) {
    return false; // Tells Vike: "Do not intercept this request, let the system load the asset naturally."
  }

  // 2. Allow all clean human URLs to pass straight through to your Vue App shell
  return {
    match: true
  };
}