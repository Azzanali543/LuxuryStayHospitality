import BillingStatusBadge from "./BillingStatusBadge";
import { formatCurrency, formatDate } from "../utils/billing";

function Row({ label, value, muted = false, strong = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/60">
        {label}
      </span>

      <span
        className={[
          "text-sm tabular-nums",
          strong ? "font-semibold text-white" : "text-white/90",
          muted && "text-white/50",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

export default function BillingSummary({ booking, breakdown }) {
  return (
  <div className="relative overflow-hidden rounded-3xl bg-[#2A211B] p-7 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(42,33,27,0.45)]">

      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-amber-400/15" />
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full border border-amber-300/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
            Billing Summary
          </p>

          <p className="mt-2 text-sm text-slate-300">
            {booking.displayId || booking.id}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-white">
            {booking.guestName}
          </h3>
        </div>

        <BillingStatusBadge
          status={booking.paymentStatus}
          inverted
        />
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 border-b border-white/10 pb-5">
        <Row
          label="Room Number"
          value={booking.roomNumber}
        />

        <Row
          label="Stay Duration"
          value={`${breakdown.nights} night${breakdown.nights > 1 ? "s" : ""}`}
        />

        <Row
          label="Check-In"
          value={formatDate(booking.checkIn)}
        />

        <Row
          label="Check-Out"
          value={formatDate(booking.checkOut)}
        />
      </div>

      <div className="mt-5">
        <Row
          label="Subtotal"
          value={formatCurrency(breakdown.subtotal)}
        />

        <Row
          label={`Tax${breakdown.taxRateLabel ? ` (${breakdown.taxRateLabel})` : ""}`}
          value={formatCurrency(breakdown.tax)}
        />

        {breakdown.discount > 0 && (
          <Row
            label="Discount"
            value={`- ${formatCurrency(breakdown.discount)}`}
            muted
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Grand Total
        </span>

       <span className="text-3xl font-bold text-[#C8A96A]">
          {formatCurrency(breakdown.grandTotal)}
        </span>
      </div>
    </div>
  );
}