const duetBrickTilesImage = new URL('../../references/local-unverified-images/duet brick tiles.jpg', import.meta.url).href;
const novaPlasterImage = new URL('../../references/local-unverified-images/Nova Plaster.jpg', import.meta.url).href;
const novaKlinkerImage = new URL('../../references/local-unverified-images/Nova Klinker.jpg', import.meta.url).href;
const rainbowBlueImage = new URL('../../references/local-unverified-images/Rainbow Blue.jpg', import.meta.url).href;
const rainbowRedWallImage = new URL('../../references/local-unverified-images/Rainbow Red Wall.jpg', import.meta.url).href;

export const productData = {
  brand: "Brick Tile Shop",
  productName: "Zambezi",
  category: "Thin Brick Tiles",
  primaryCta: "VIEW PRODUCTS",
  materialStory: {
    title: "FIRED CLAY",
    subtitle: "AUTHENTIC TEXTURE",
    description: "Crafted from natural clay and fired to perfection, Zambezi thin brick tiles offer a rich, granular surface with authentic tonal variation. The darker outer edges frame a warm, earthy core, delivering a premium architectural finish.",
    metrics: [
      { value: "100%", label: "NATURAL CLAY", description: "Sourced and fired for maximum durability and authentic aesthetic." },
      { value: "9mm", label: "THICKNESS", description: "Optimized profile for seamless interior and exterior cladding." }
    ]
  },
  technical: {
    title: "TECHNICAL SPEC",
    specs: [
      { label: "LENGTH", value: "220mm", position: { x: -1, y: 1 } },
      { label: "HEIGHT", value: "73mm", position: { x: -1, y: -1 } },
      { label: "THICKNESS", value: "9mm", position: { x: 1, y: 1 } },
      { label: "FINISH", value: "Matte / Granular", position: { x: 1, y: -1 } }
    ]
  },
  installationShowcase: {
    eyebrow: "ZAMBEZI INSTALLATION STUDY",
    title: "Architectural warmth, composed with restraint.",
    description:
      "Zambezi is at its strongest when the tonal shifts stay visible across long elevations and quiet interior surfaces. The result is a darker, premium clay expression that reads tactile up close and disciplined from a distance.",
    editorialNotes: [
      {
        label: "SURFACE CHARACTER",
        value: "Granular fired-clay variation with darker edge definition."
      },
      {
        label: "DESIGN EFFECT",
        value: "Works best when repeated in disciplined runs with consistent joint spacing."
      },
      {
        label: "APPLICATION MOOD",
        value: "Suited to feature walls, covered exterior planes, and material-led hospitality interiors."
      }
    ],
    primaryImage: duetBrickTilesImage,
    secondaryImage: novaPlasterImage,
    detailImage: rainbowBlueImage
  },
  visualLab: {
    title: "VISUAL LAB",
    subtitle: "Customize your installation.",
    groutColors: [
      { id: "light", name: "Light", hex: "#e5e5e5" },
      { id: "charcoal", name: "Charcoal", hex: "#333333" },
      { id: "sand", name: "Warm Sand", hex: "#d2b48c" }
    ],
    layouts: [
      { id: "stretcher", name: "Stretcher Bond" },
      { id: "stack", name: "Stack Bond" }
    ],
    lighting: [
      { id: "daylight", name: "Soft Daylight" },
      { id: "interior", name: "Warm Interior" }
    ]
  },
  relatedProducts: {
    eyebrow: "TOP SELLERS",
    title: "Explore nearby finishes from the BTS material library.",
    description:
      "A compact reference strip to keep the main microsite shoppable without breaking the premium product narrative.",
    products: [
      {
        name: "Nova Klinker",
        image: novaKlinkerImage
      },
      {
        name: "Nova Plaster",
        image: novaPlasterImage
      },
      {
        name: "Rainbow Blue",
        image: rainbowBlueImage
      },
      {
        name: "Rainbow Red Wall",
        image: rainbowRedWallImage
      }
    ]
  }
};
