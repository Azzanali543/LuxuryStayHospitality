import BillingStatusBadge from "./BillingStatusBadge";
import { formatCurrency } from "../utils/billing";

function Line({ label, value, isTotal = false, isDiscount = false }) {
  return (
    <div
      className={`flex items-center justify-between ${
        isTotal
          ? "mt-3 border-t border-[#E9E4DD] pt-4"
          : "py-2"
      }`}
    >
      <span
        className={`${
          isTotal
            ? "text-sm font-semibold text-[#2A211B]"
            : "text-sm text-[#6B625B]"
        }`}
      >
        {label}
      </span>

      <span
        className={`font-mono ${
          isTotal
            ? "text-xl font-bold text-[#C8A96A]"
            : isDiscount
            ? "text-sm font-semibold text-[#2F6B4F]"
            : "text-sm font-medium text-[#2A211B]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function CostBreakdown({ booking, breakdown }) {
  return (
    <section className="rounded-3xl border border-[#E9E4DD] bg-white p-6 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#2A211B]">
          Cost Breakdown
        </h3>

        <BillingStatusBadge status={booking.paymentStatus} />
      </div>

      <div className="mt-4">
        {breakdown.charges.map((charge, index) => (
          <Line
            key={`${charge.label}-${index}`}
            label={charge.label}
            value={formatCurrency(charge.amount)}
          />
        ))}

        <Line
          label={`Tax${
            breakdown.taxRateLabel
              ? ` (${breakdown.taxRateLabel})`
              : ""
          }`}
          value={formatCurrency(breakdown.tax)}
        />

        {breakdown.discount > 0 && (
          <Line
            label="Discount"
            value={`- ${formatCurrency(
              breakdown.discount
            )}`}
            isDiscount
          />
        )}

        <Line
          label="Grand Total"
          value={formatCurrency(breakdown.grandTotal)}
          isTotal
        />
      </div>
    </section>
  );
}