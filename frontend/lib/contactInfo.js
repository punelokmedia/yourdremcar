/** Business contact — single source for display, tel:, and WhatsApp links. */
export const CONTACT_PHONE_DISPLAY = "+91 87664 03074";
export const CONTACT_PHONE_E164 = "918766403074";

const DEFAULT_WHATSAPP_TEXT = "Hi, I would like to know more about Your Dream Cars.";

export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_E164}?text=${encodeURIComponent(DEFAULT_WHATSAPP_TEXT)}`;
export const TEL_HREF = `tel:+${CONTACT_PHONE_E164}`;
