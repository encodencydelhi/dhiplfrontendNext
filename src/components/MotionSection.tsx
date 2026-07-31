"use client";

import { m, HTMLMotionProps } from "framer-motion";
import React from "react";

interface MotionSectionProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

const MotionSection = ({ children, ...props }: MotionSectionProps) => {
  return <m.div {...props}>{children}</m.div>;
};

export default MotionSection;
