
import React from "react";
import NavbarWithTheme from "@/components/NavbarWithTheme";
import Index from "./Index";

const FallbackIndex = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <NavbarWithTheme />
      <Index />
    </div>
  );
};

export default FallbackIndex;
