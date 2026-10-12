import React from "react";
import { COLORS } from "../constants/theme";

const SpecialRequests = ({ specialRequests }) => {
  const text = (specialRequests || "").trim();

  return (
    <div className="mt-3 w-full">
      <div
        className="rounded-3xl border p-6 shadow-lg transition-all duration-300"
        style={{
          backgroundColor: COLORS.SURFACE,
          borderColor: COLORS.BORDER,
        }}
      >
        <h2
          className="text-xl font-semibold tracking-wide"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Special Requests
        </h2>

        <p
          className="mt-2 text-sm leading-6"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Requests submitted when you confirmed this booking.
        </p>

        <div
          className="mt-5 rounded-2xl border p-5 text-sm leading-7 whitespace-pre-wrap transition-all duration-300"
          style={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            backgroundColor: COLORS.BACKGROUND,
          }}
        >
          {text || "No special requests were provided for this booking."}
        </div>
      </div>
    </div>
  );
};

export default SpecialRequests;