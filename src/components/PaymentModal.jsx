import React from 'react';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  expired: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  failed: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
};

const STATUS_LABELS = {
  pending: 'Waiting for payment',
  paid: 'Paid successfully',
  cancelled: 'Cancelled',
  expired: 'Expired',
  failed: 'Failed'
};

const formatVnd = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0);

const formatDateTime = (value) => {
  if (!value) return '--';
  return new Date(value).toLocaleString('en-GB');
};

export default function PaymentModal({
  isOpen,
  payment,
  actionLoading,
  onClose,
  onRefresh,
  onCancel,
  onProceedToGateway
}) {
  if (!isOpen || !payment) return null;

  const statusClassName = STATUS_STYLES[payment.status] || STATUS_STYLES.pending;
  const statusLabel = STATUS_LABELS[payment.status] || 'Unknown';
  const isPending = payment.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-500">VNPay Sandbox</p>
            <h3 className="mt-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
              Pay for the {payment.plan} plan with VNPay
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Create the order here, continue to the VNPay sandbox gateway, then come back to the app after finishing the test payment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close payment modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order code</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">{payment.orderCode}</p>
                </div>
                <span className={`rounded-full border px-4 py-2 text-xs font-bold ${statusClassName}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-3.5 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-800 dark:text-white">
                    {formatVnd(payment.amount)} {payment.currency}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Provider</p>
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{payment.bankName || 'VNPay Sandbox'}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expires at</p>
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{formatDateTime(payment.expiresAt)}</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gateway transaction</p>
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{payment.gatewayTransactionNo || '--'}</p>
                </div>
              </div>
            </div>

            <div className="">
              <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">VNPay order info</p>
                <p className="mt-2 text-base font-extrabold text-slate-800 dark:text-slate-100">Sandbox checkout</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="font-bold text-slate-400 dark:text-slate-500">Payment URL status</p>
                    <p className="mt-1 font-extrabold text-slate-800 dark:text-slate-100">
                      {payment.paymentUrl ? 'Ready to open in VNPay' : 'Unavailable'}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 dark:text-slate-500">Order reference</p>
                    <p className="mt-1 font-extrabold text-slate-800 dark:text-slate-100">{payment.transferContent || payment.orderCode}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 dark:text-slate-500">Gateway bank code</p>
                    <div className="mt-1 rounded-2xl bg-slate-50 px-3 py-2.5 font-extrabold text-violet-600 dark:bg-slate-800 dark:text-violet-300">
                      {payment.gatewayBankCode || payment.bankCode || 'Customer selects on VNPay'}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sandbox test card</p>
                <ul className="mt-4 space-y-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <li>Bank: NCB</li>
                  <li>Card number: 9704198526191432198</li>
                  <li>Card holder: NGUYEN VAN A</li>
                  <li>Issue date: 07/15</li>
                  <li>OTP: 123456</li>
                </ul>

                <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 dark:border-violet-900 dark:bg-violet-900/30 dark:text-violet-300">
                  This uses the official VNPay sandbox. No real money is charged, but the redirect and return flow are real.
                </div>
              </div> */}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">How it works</p>
              <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <ol className="space-y-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <li>1. Click the button below to open the VNPay sandbox checkout page.</li>
                  <li>2. Choose a test payment method and complete the sandbox steps.</li>
                  <li>3. VNPay redirects you back to the billing tab after payment.</li>
                  <li>4. The app refreshes the order and activates your plan when the transaction succeeds.</li>
                </ol>
              </div>
              <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Keep this modal open if you want to review the order before opening the gateway.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={actionLoading}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {actionLoading ? 'Processing...' : 'Refresh status'}
                </button>

                <button
                  type="button"
                  onClick={onProceedToGateway}
                  disabled={!isPending || actionLoading || !payment.paymentUrl}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-600/50"
                >
                  {actionLoading ? 'Processing...' : 'Continue to VNPay'}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={!isPending || actionLoading}
                  className="w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/40"
                >
                  Cancel order
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Close
                </button>
              </div>

              {payment.paidAt && (
                <p className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  Paid at: {formatDateTime(payment.paidAt)}
                </p>
              )}

              {payment.gatewayResponseCode && (
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Gateway response code: {payment.gatewayResponseCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
