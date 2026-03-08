import React, { useEffect } from "react";
import "./LoadingSpinner.css";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LoadingSpinner({
  fullScreen = true,
  overlay = false,
  backdrop,
  size = "md",
  label = "로딩 중",
  lockScroll = overlay,
  minHeight,
  className = "",
  style,
  ...rest
}) {
  const resolvedBackdrop = backdrop ?? (overlay ? "solid" : "none");

  const sizeClass =
    size === "sm"
      ? "loadingSpinner--sm"
      : size === "lg"
      ? "loadingSpinner--lg"
      : "loadingSpinner--md";

  const backdropClass =
    resolvedBackdrop === "solid"
      ? "loadingSpinner--solid"
      : resolvedBackdrop === "dim"
      ? "loadingSpinner--dim"
      : resolvedBackdrop === "blur"
      ? "loadingSpinner--blur"
      : "";

  useEffect(() => {
    if (!overlay || !lockScroll) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [overlay, lockScroll]);

  const rootStyle = {
    ...(style || {}),
    ...(fullScreen && minHeight ? { minHeight } : null),
  };

  return (
    <div
      className={cx(
        "loadingSpinner",
        overlay
          ? "loadingSpinner--overlay"
          : fullScreen
          ? "loadingSpinner--fullScreen"
          : "loadingSpinner--inline",
        sizeClass,
        backdropClass,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={rootStyle}
      {...rest}
    >
      <div className="loadingSpinner__spinner" aria-hidden="true" />
      <span className="loadingSpinner__srOnly">{label}</span>
    </div>
  );
}