import React from "react";
import { COLORS } from "../constants/theme";

const SpecialRequests = ({ specialRequests }) => {
  const text = (specialRequests || "").trim();

  return (
    <div className="w-full mt-3">
      <div
        className="rounded-3xl border shadow-md p-6 sm:p-8"
        style={{
          backgroundColor: COLORS.SURFACE,
          borderColor: COLORS.BORDER,
        }}
      >
        <h2 className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
          Special Requests
        </h2>

        <p className="mt-2 text-sm leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
          Requests submitted when you confirmed this booking.
        </p>

        <div
          className="mt-6 rounded-xl p-4 text-sm min-h-[100px] whitespace-pre-wrap"
          style={{
            border: `1px solid ${COLORS.BORDER}`,
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