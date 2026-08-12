(() => {
  const mountPhoto = (selector, source, alt, modifier = "") => {
    const container = document.querySelector(selector);
    if (!container) return;

    const photo = new Image();
    photo.className = "brand-photo__image";
    photo.src = source;
    photo.alt = alt;
    photo.decoding = "async";

    container.classList.add("brand-photo");
    if (modifier) container.classList.add(modifier);
    container.removeAttribute("role");
    container.removeAttribute("aria-label");
    container.replaceChildren(photo);
  };

  mountPhoto(
    ".hero .placeholder",
    "assets/generated/true-print-hero-blue-logo-v3.png",
    "True Print Shop apparel team wearing embroidered custom clothing",
    "brand-photo--hero"
  );

  mountPhoto(
    ".embroidery .placeholder",
    "assets/generated/true-print-embroidery-detail-v2.png",
    "True Print Shop embroidery machine stitching the complete logo",
    "brand-photo--embroidery"
  );

  mountPhoto(
    "#custom .placeholder",
    "assets/generated/true-print-custom-apparel-v2.png",
    "True Print Shop custom apparel studio",
    "brand-photo--custom"
  );
})();
