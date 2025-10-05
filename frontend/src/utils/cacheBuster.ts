// Cache busting utility
export const getCacheBuster = () => {
  return `?v=${Date.now()}`;
};

// Force refresh function
export const forceRefresh = () => {
  window.location.reload();
};
