import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import PaymentModal from './PaymentModal';

const API_BASE = "https://task-flow-be-iota.vercel.app/api" || 'http://localhost:5050/api';

const PLAN_CONFIG = {
  Free: {
    amount: 0,
    currencyLabel: 'VND/month',
    cta: 'Current plan'
  },
  Premium: {
    amount: 199000,
    currencyLabel: 'VND/month',
    cta: 'Pay now'
  },
  VIP: {
    amount: 399000,
    currencyLabel: 'VND/month',
    cta: 'Pay now'
  }
};

const formatVnd = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0);

export default function BillingTab({ user, token, fetchUserInfo, showNotification }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState(null);
  const handledReturnRef = useRef('');

  const currentPlan = user?.plan || 'Free';
  const planCards = useMemo(() => PLAN_CONFIG, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderCode = params.get('paymentOrder');
    const status = params.get('paymentStatus');
    const message = params.get('paymentMessage');

    if (!token || !orderCode) return;

    const signature = `${orderCode}:${status || ''}`;
    if (handledReturnRef.current === signature) return;
    handledReturnRef.current = signature;

    const handleGatewayReturn = async () => {
      const payment = await refreshPaymentOrder(orderCode, false);
      if (payment) {
        setPaymentModalOpen(true);
        await fetchUserInfo(token);
      }

      if (message) {
        const notificationType = status === 'paid' ? 'success' : status === 'pending' ? 'info' : 'warning';
        showNotification(message, notificationType);
      }

      params.delete('paymentOrder');
      params.delete('paymentStatus');
      params.delete('paymentMessage');
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`;
      window.history.replaceState(null, '', nextUrl);
    };

    handleGatewayReturn();
  }, [token]);

  const handleSelectPlan = async (planName) => {
    if (planName === currentPlan) return;

    try {
      setLoadingPlan(planName);

      if (planName === 'Free') {
        await axios.put(
          `${API_BASE}/auth/plan`,
          { plan: 'Free' },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await fetchUserInfo(token);
        showNotification('Your account has been switched back to the Free plan.', 'success');
        return;
      }

      const res = await axios.post(
        `${API_BASE}/payments/create`,
        { plan: planName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setActivePayment(res.data.payment);
      setPaymentModalOpen(true);
      showNotification(res.data.message || `A VNPay payment order for the ${planName} plan has been created.`, 'info');
    } catch (err) {
      console.error('Error starting billing flow:', err);
      showNotification(err.response?.data?.message || 'An error occurred while starting the payment flow.', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const refreshPaymentOrder = async (orderCode = activePayment?.orderCode, notify = true) => {
    if (!orderCode) return;

    try {
      setPaymentActionLoading(true);
      const res = await axios.get(`${API_BASE}/payments/${orderCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivePayment(res.data.payment);
      if (notify) {
        showNotification(`Payment status: ${res.data.payment.status}.`, res.data.payment.status === 'paid' ? 'success' : 'info');
      }
      return res.data.payment;
    } catch (err) {
      console.error('Error refreshing payment order:', err);
      showNotification(err.response?.data?.message || 'Unable to refresh the payment status.', 'error');
      return null;
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!activePayment?.orderCode) return;

    try {
      setPaymentActionLoading(true);
      const res = await axios.post(`${API_BASE}/payments/${activePayment.orderCode}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActivePayment(res.data.payment);
      showNotification(res.data.message || 'The payment order has been cancelled.', 'warning');
    } catch (err) {
      console.error('Error cancelling payment:', err);
      showNotification(err.response?.data?.message || 'Unable to cancel the payment order.', 'error');
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handleProceedToGateway = () => {
    if (!activePayment?.paymentUrl) {
      showNotification('The VNPay payment URL is missing for this order.', 'error');
      return;
    }

    window.location.href = activePayment.paymentUrl;
  };

  return (
    <div className="flex-1 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 flex flex-col h-full overflow-y-auto">
      <PaymentModal
        isOpen={paymentModalOpen}
        payment={activePayment}
        actionLoading={paymentActionLoading}
        onClose={closePaymentModal}
        onRefresh={() => refreshPaymentOrder()}
        onCancel={handleCancelPayment}
        onProceedToGateway={handleProceedToGateway}
      />

      {/* Header Info */}
      <div className="shrink-0 text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          Choose the plan that's right for you
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Paid plans now use the official VNPay sandbox flow, including redirecting to the gateway and returning to the billing tab after payment.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full items-start pb-12">
        
        {/* FREE / ESSENTIAL PLAN CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <h4 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-6 text-center">Free</h4>
          
          {/* Blue Ribbon Medal SVG */}
          <div className="w-24 h-24 flex items-center justify-center mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Ribbon Tails */}
              <path d="M40 50 L30 85 L45 80 L50 60 Z" fill="#2563EB" />
              <path d="M60 50 L70 85 L55 80 L50 60 Z" fill="#1D4ED8" />
              <path d="M43 50 L38 85 L48 80 L50 60 Z" fill="#3B82F6" />
              <path d="M57 50 L62 85 L52 80 L50 60 Z" fill="#2563EB" />
              {/* Medal Ring */}
              <circle cx="50" cy="40" r="22" fill="#1E3A8A" />
              <circle cx="50" cy="40" r="18" fill="#3B82F6" />
              <circle cx="50" cy="40" r="15" fill="#2563EB" />
              {/* Star */}
              <path d="M50 30 L53 36 L60 37 L55 42 L56 49 L50 45 L44 49 L45 42 L40 37 L47 36 Z" fill="#FFFFFF" />
            </svg>
          </div>

          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatVnd(planCards.Free.amount)}</span>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">{planCards.Free.currencyLabel}</p>
          </div>

          {/* Button */}
          <button
            onClick={() => handleSelectPlan('Free')}
            disabled={currentPlan === 'Free' || loadingPlan !== null}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-8 cursor-pointer ${
              currentPlan === 'Free'
                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-default dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95'
            }`}
          >
            {currentPlan === 'Free' ? 'Current plan' : loadingPlan === 'Free' ? 'Processing...' : 'Downgrade'}
          </button>

          {/* Features List */}
          <div className="w-full space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Essential features for TaskFlow
            </h5>
            <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-450 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Up to 2 active projects</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Up to 15 tasks per project</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Invite up to 3 members per project</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Basic drag-and-drop Kanban board</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Personal category classification</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Basic progress statistics</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Light/Dark mode interface</span>
              </li>
              {/* <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>
                  1,000 <span className="text-blue-500 font-bold cursor-pointer hover:underline">monthly credits</span>
                </span>
              </li> */}
            </ul>
          </div>
        </div>

        {/* PREMIUM PLAN CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <h4 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-6 text-center">Premium</h4>

          {/* Premium Ribbon Medal SVG */}
          <div className="w-24 h-24 flex items-center justify-center mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Ribbons */}
              <path d="M40 50 L32 88 L46 83 L50 60 Z" fill="#DC2626" />
              <path d="M60 50 L68 88 L54 83 L50 60 Z" fill="#B91C1C" />
              <path d="M44 50 L40 88 L48 83 L50 60 Z" fill="#3B82F6" />
              <path d="M56 50 L60 88 L52 83 L50 60 Z" fill="#2563EB" />
              {/* Gold Medal Outer */}
              <circle cx="50" cy="40" r="22" fill="#F59E0B" />
              <circle cx="50" cy="40" r="18" fill="#FBBF24" />
              {/* Premium Bar Ribbon */}
              <rect x="26" y="34" width="48" height="12" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
              <rect x="28" y="36" width="44" height="8" rx="2" fill="#FCD34D" />
              {/* Text inside banner */}
              <text x="50" y="42" fill="#78350F" fontSize="5" fontWeight="900" textAnchor="middle" letterSpacing="0.2">PREMIUM</text>
            </svg>
          </div>

          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatVnd(planCards.Premium.amount)}</span>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">{planCards.Premium.currencyLabel}</p>
          </div>

          {/* Button */}
          <button
            onClick={() => handleSelectPlan('Premium')}
            disabled={currentPlan === 'Premium' || loadingPlan !== null}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-8 cursor-pointer ${
              currentPlan === 'Premium'
                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-default dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95'
            }`}
          >
            {currentPlan === 'Premium' ? 'Current plan' : loadingPlan === 'Premium' ? 'Creating order...' : planCards.Premium.cta}
          </button>

          {/* <div className="mb-8 w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[11px] font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
            Payment method: VNPay sandbox. You will be redirected to the VNPay test gateway to complete the payment.
          </div> */}

          {/* Features List */}
          <div className="w-full space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Everything in Free plan, plus
            </h5>
            <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-450 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Up to 10 active projects</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Up to 50 tasks per project</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Invite up to 10 members per project</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Custom project identification colors</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Advanced trend statistics charts</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Assign task assignees</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Real-time synchronization</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Priority support via Email</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Export tasks report in Excel format</span>
              </li>
            </ul>
          </div>
        </div>

        {/* VIP PLAN CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-sm relative overflow-hidden transition-all hover:shadow-md ring-2 ring-violet-500/10">
          <div className="absolute top-0 right-0 bg-violet-600 text-white font-bold text-[9px] py-1 px-4 rounded-bl-2xl uppercase tracking-wider shadow-sm">
            Best value
          </div>

          <h4 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-6 text-center">VIP</h4>

          {/* VIP Laurel Wreath & Gold Shield SVG */}
          <div className="w-24 h-24 flex items-center justify-center mb-6 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
              {/* Gold Laurel Wreath Left */}
              <g fill="#D97706">
                <path d="M40 85 C30 80, 25 70, 25 60 C25 50, 30 40, 40 35 C38 42, 38 52, 41 60 C44 68, 48 74, 52 78 C48 81, 44 83, 40 85 Z" opacity="0.8"/>
                {/* Leaves */}
                <path d="M22 62 Q15 60 18 53 Q25 55 22 62 Z" />
                <path d="M25 48 Q18 43 23 37 Q28 42 25 48 Z" />
                <path d="M31 36 Q25 29 32 24 Q36 30 31 36 Z" />
                <path d="M41 27 Q37 19 44 16 Q47 23 41 27 Z" />
                <path d="M24 75 Q17 77 17 70 Q24 68 24 75 Z" />
              </g>
              {/* Gold Laurel Wreath Right */}
              <g fill="#D97706" transform="translate(120, 0) scale(-1, 1)">
                <path d="M40 85 C30 80, 25 70, 25 60 C25 50, 30 40, 40 35 C38 42, 38 52, 41 60 C44 68, 48 74, 52 78 C48 81, 44 83, 40 85 Z" opacity="0.8"/>
                {/* Leaves */}
                <path d="M22 62 Q15 60 18 53 Q25 55 22 62 Z" />
                <path d="M25 48 Q18 43 23 37 Q28 42 25 48 Z" />
                <path d="M31 36 Q25 29 32 24 Q36 30 31 36 Z" />
                <path d="M41 27 Q37 19 44 16 Q47 23 41 27 Z" />
                <path d="M24 75 Q17 77 17 70 Q24 68 24 75 Z" />
              </g>

              {/* Shield base */}
              <path d="M60 25 C75 25 82 30 82 45 C82 65 72 85 60 95 C48 85 38 65 38 45 C38 30 45 25 60 25 Z" fill="#78350F" />
              <path d="M60 28 C73 28 79 32 79 45 C79 63 70 82 60 91 C50 82 41 63 41 45 C41 32 47 28 60 28 Z" fill="#F59E0B" />
              <path d="M60 30 C71 30 77 34 77 45 C77 61 68 79 60 88 C52 79 43 61 43 45 C43 34 49 30 60 30 Z" fill="#FBBF24" />
              <path d="M60 30 L60 88 C68 79 77 61 77 45 C77 34 71 30 60 30 Z" fill="#F59E0B" /> {/* Inner Shadow half */}

              {/* Stars on top */}
              <g fill="#FEF08A">
                <path d="M60 38 L62 42 L67 42 L63 45 L64 49 L60 47 L56 49 L57 45 L53 42 L58 42 Z" />
              </g>

              {/* VIP text inside */}
              <text x="60" y="65" fill="#78350F" fontSize="16" fontWeight="900" textAnchor="middle" letterSpacing="0.5">VIP</text>

              {/* 5 Stars under VIP */}
              <g fill="#D97706" transform="translate(36, 68) scale(0.6)">
                <path d="M20 15 L22 19 L27 19 L23 22 L24 26 L20 24 L16 26 L17 22 L13 19 L18 19 Z" />
                <path d="M35 15 L37 19 L42 19 L38 22 L39 26 L35 24 L31 26 L32 22 L28 19 L33 19 Z" />
                <path d="M50 15 L52 19 L57 19 L53 22 L54 26 L50 24 L46 26 L47 22 L43 19 L48 19 Z" />
                <path d="M65 15 L67 19 L72 19 L68 22 L69 26 L65 24 L61 26 L62 22 L58 19 L63 19 Z" />
                <path d="M80 15 L82 19 L87 19 L83 22 L84 26 L80 24 L76 26 L77 22 L73 19 L78 19 Z" />
              </g>
            </svg>
          </div>

          <div className="text-center mb-6">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{formatVnd(planCards.VIP.amount)}</span>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">{planCards.VIP.currencyLabel}</p>
          </div>

          {/* Button */}
          <button
            onClick={() => handleSelectPlan('VIP')}
            disabled={currentPlan === 'VIP' || loadingPlan !== null}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-8 cursor-pointer ${
              currentPlan === 'VIP'
                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-default dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95'
            }`}
          >
            {currentPlan === 'VIP' ? 'Current plan' : loadingPlan === 'VIP' ? 'Creating order...' : planCards.VIP.cta}
          </button>

          {/* <div className="mb-8 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left text-[11px] font-bold text-violet-700 dark:border-violet-900 dark:bg-violet-900/20 dark:text-violet-300">
            Includes the same VNPay sandbox payment flow plus all premium features and unlimited usage limits.
          </div> */}

          {/* Features List */}
          <div className="w-full space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Everything in Premium plan, plus
            </h5>
            <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-450 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Unlimited active projects</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Unlimited tasks</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Unlimited project members</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Custom workflow columns (Kanban)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Independent cloud backup</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>In-depth team performance analytics</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>API access & Webhook integration</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>Advanced security system & SSO</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>24/7 expert phone support</span>
              </li>
              {/* <li className="flex items-start gap-2.5">
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span>
                  10,000 <span className="text-blue-500 font-bold cursor-pointer hover:underline">monthly credits</span>
                </span>
              </li> */}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
