import FontFaceObserver from "fontfaceobserver";

export const loadFonts = async () => {
  const Inter = new FontFaceObserver("Inter");
  const Tangerine = new FontFaceObserver("Tangerine");

  return Promise.all([Inter.load(), Tangerine.load()])
    .then(() => {
      document.documentElement.classList.add("fonts-loaded");
    })
    .catch(() => {
      console.error("Fonts failed to load");
    });
};
