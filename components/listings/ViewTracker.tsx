"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "@/app/actions/listings";

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    incrementViewCount(propertyId);
  }, [propertyId]);

  return null;
}
