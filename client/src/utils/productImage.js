function encodeSvg(value) {
  return encodeURIComponent(value)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/");
}

function getInitials(title = "") {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "LS";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

export function createProductPlaceholder(title = "Luxe Store", category = "Curated") {
  const safeTitle = (title || "Luxe Store").trim().slice(0, 28);
  const safeCategory = (category || "Curated").trim().slice(0, 22);
  const initials = getInitials(safeTitle);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8f4ef" />
          <stop offset="100%" stop-color="#eadcc7" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" rx="36" fill="url(#bg)" />
      <circle cx="300" cy="170" r="84" fill="#1a1714" opacity="0.08" />
      <circle cx="300" cy="170" r="64" fill="#c9a96e" />
      <text x="300" y="189" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#fffdf8">${initials}</text>
      <text x="300" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6d5d4e">${safeTitle}</text>
      <rect x="206" y="320" width="188" height="36" rx="18" fill="#ffffff" opacity="0.92" />
      <text x="300" y="344" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" letter-spacing="1.5" fill="#8a6a3d">${safeCategory.toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeSvg(svg)}`;
}

export const DEFAULT_PRODUCT_IMAGE = createProductPlaceholder();

export function getProductImage(image, title, category) {
  return image?.trim() ? image : createProductPlaceholder(title, category);
}
