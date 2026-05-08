import { lazy } from "react";

const artifacts = [
  {
    slug: "bonvoy-calc",
    title: "Bonvoy Points Calculator",
    description:
      "Compare Marriott hotels by cents-per-point value. Enter points and cash rates for up to 8 properties to find the best redemption, then export results as Markdown.",
    icon: "🏨",
    tags: ["Travel", "Finance"],
    component: lazy(() => import("../bonvoy-calc.jsx")),
  },
];

export default artifacts;
