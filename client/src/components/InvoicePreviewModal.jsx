import InvoiceDocument from "./InvoiceDocument";

export default function InvoicePreviewModal({
  open,
  onClose,
  booking,
  breakdown,
  invoiceNumber,
  onPrint,
  onDownloadPdf,
}) {
  if (!open || !booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-[#E9E4DD] bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#2A211B]">
            Invoice Preview
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="rounded-xl border border-[#E9E4DD] px-4 py-2 text-xs font-medium text-[#2A211B] transition-all duration-200 hover:border-[#C8A96A] hover:text-[#C8A96A]"
            >
              Print
            </button>

            <button
              onClick={onDownloadPdf}
              className="rounded-xl border border-[#E9E4DD] px-4 py-2 text-xs font-medium text-[#2A211B] transition-all duration-200 hover:border-[#C8A96A] hover:text-[#C8A96A]"
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B625B] transition-all duration-200 hover:bg-[#F8F6F3] hover:text-[#2A211B]"
              aria-label="Close invoice preview"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <InvoiceDocument
          booking={booking}
          breakdown={breakdown}
          invoiceNumber={invoiceNumber}
        />
      </div>
    </div>
  );
}