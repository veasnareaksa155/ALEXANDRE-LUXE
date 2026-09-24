/**
 * Cloudinary Upload Service for Alexandre Luxe E-Commerce
 * Supports unsigned image upload directly from browser to Cloudinary CDN
 */

// Retrieve active Cloudinary settings from localStorage or environment
export const getCloudinaryConfig = () => {
  try {
    const saved = localStorage.getItem("alexandre_luxe_cloudinary");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed.cloudName &&
        parsed.uploadPreset &&
        parsed.cloudName !== "legacy_store"
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse local Cloudinary settings:", e);
  }

  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "f2fikysb",
    uploadPreset:
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "legacy_store",
  };
};

// Save custom Cloudinary credentials to localStorage
export const saveCloudinaryConfig = (cloudName, uploadPreset) => {
  try {
    const config = {
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim(),
    };
    localStorage.setItem("alexandre_luxe_cloudinary", JSON.stringify(config));
    return config;
  } catch (e) {
    console.error("Failed to save Cloudinary settings:", e);
    return null;
  }
};

/**
 * Upload a File object or Blob to Cloudinary CDN
 * @param {File|Blob} file File object to upload
 * @param {Object} customConfig Optional custom { cloudName, uploadPreset }
 * @returns {Promise<{ success: boolean, url: string, publicId?: string, isFallback?: boolean, error?: string }>}
 */
export const uploadToCloudinary = async (file, customConfig = null) => {
  let config = customConfig;
  if (!config || !config.cloudName || config.cloudName === "legacy_store") {
    config = getCloudinaryConfig();
  }
  const { cloudName, uploadPreset } = config;

  // 1. Try Direct Cloudinary Unsigned Upload API
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Generate unique ID to prevent any image collisions or random overwrites
    const uniqueId = `lx_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    formData.append("public_id", uniqueId);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.secure_url) {
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
          isCloudinary: true,
        };
      }
    } else {
      const errJson = await response.json().catch(() => ({}));
      const errMsg =
        errJson?.error?.message ||
        `HTTP ${response.status}: Cloudinary upload failed`;
      console.warn("Cloudinary upload failed:", errMsg);
    }
  } catch (err) {
    console.warn(
      "Cloudinary direct fetch failed, falling back to FileReader:",
      err,
    );
  }

  // 2. Safe Fallback to Data URL if Cloudinary preset is invalid or offline
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        success: true,
        url: e.target.result,
        isFallback: true,
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        url: "",
        error: "Failed to read file",
      });
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Safe Helper to parse gallery URLs without corrupting Data URLs or JSON strings
 * @param {string|Array} galleryRaw
 * @returns {Array<string>} List of clean image URLs
 */
export const parseGalleryUrls = (galleryRaw) => {
  if (!galleryRaw) return [];
  if (Array.isArray(galleryRaw)) return galleryRaw.filter(Boolean);

  if (typeof galleryRaw === "string") {
    const trimmed = galleryRaw.trim();
    if (!trimmed) return [];

    // Try parsing as JSON array
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {}
    }

    // Check if raw string contains base64 data URLs
    if (trimmed.includes("data:image")) {
      // Extract data URLs and standard URLs using regex
      const regex =
        /(data:image\/[a-zA-Z0-9+\/;-]+;base64,[A-Za-z0-9+\/=]+|https?:\/\/[^\s,]+)/g;
      const matches = trimmed.match(regex);
      if (matches && matches.length > 0) {
        return matches;
      }
    }

    // Default: split by comma if standard URL strings
    return trimmed
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
  }

  return [];
};
