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
  }
};
