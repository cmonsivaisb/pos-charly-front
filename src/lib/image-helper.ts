export function getCatalogImageUrl(
  product: { imageKey?: string | null } | null,
  category: { defaultImageKey?: string | null } | null,
  baseUrl: string = ''
): string {
  // 1. Product specific image (imageKey in DB is typically just the filename or path after /public/)
  if (product?.imageKey?.trim()) {
    return `${baseUrl}/${product.imageKey}`;
  }

  // 2. Category default image
  if (category?.defaultImageKey?.trim()) {
    return `${baseUrl}/${category.defaultImageKey}`;
  }

  // 3. Fallback
  return `${baseUrl}/catalog/placeholders/default.svg`;
}

export function getProductImageUrl(product: any, baseUrl: string = 'http://localhost:3001'): string {
  if (product?.imagePath) {
    // Tenant custom image
    // Ensure backslashes are replaced if windows path
    const cleanPath = product.imagePath.replace(/\\/g, '/');
    return `${baseUrl}/${cleanPath}`;
  }
  
  if (product?.catalogProduct) {
    return getCatalogImageUrl(product.catalogProduct, product.catalogProduct.category, '');
  }

  // Fallback for non-catalog products without image
  // We try to use the product's category defaultImageKey if it exists
  if (product?.category?.defaultImageKey) {
    return `/${product.category.defaultImageKey}`;
  }

  return '/catalog/placeholders/default.svg';
}
