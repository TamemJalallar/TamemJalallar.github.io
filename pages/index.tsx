import React from "react";
import HomePageClient from "../app/HomePageClient";
import data from "../data.json";

export default function IndexPage() {
  return <HomePageClient data={data} />;
}
