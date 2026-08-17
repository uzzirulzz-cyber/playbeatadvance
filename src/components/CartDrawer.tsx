import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Check, 
  Copy, 
  Download, 
  Lock, 
  Tag, 
  AlertCircle,
  QrCode,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartTotalCount,
    cartSubtotalPKR,
    cartDiscountPKR,
    cartFinalTotalPKR,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    processCheckout,
    currency
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  
  // Checkout flow states
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [selectedGateway, setSelectedGateway] = useState<Order['paymentMethod']>('jazzcash');
  
  // Customer details
  const [customerName, setCustomerName] = useState('Alex Vance');
  const [customerEmail, setCustomerEmail] = useState('alex@playbeat.io');
  const [customerPhone, setCustomerPhone] = useState('03001234567');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = processCheckout(selectedGateway, {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      });
      setCompletedOrder(order);
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === 'success') {
      setStep('cart');
      setCompletedOrder(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-dropdown border-l border-indigo-500/30 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {step === 'cart' ? 'Your Digital Cart' : step === 'checkout' ? 'Secure Checkout' : 'Order Confirmed!'}
                </h3>
                <span className="text-xs text-slate-400">
                  {step === 'cart' ? `${cartTotalCount} item(s) selected` : step === 'checkout' ? 'Select payment method' : 'Instant digital delivery'}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 1: CART ITEMS VIEW */}
          {step === 'cart' && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-white text-base">Your cart is currently empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Explore our digital marketplace for Netflix passes, AI tools, 4K smart projectors, and Steam keys.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => {
                    const price = item.product.discountPrice ?? item.product.price;
                    return (
                      <div 
                        key={item.product.id}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                          {item.product.cover.image ? (
                            <img 
                              src={item.product.cover.image} 
                              alt={item.product.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Zap className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {item.product.title}
                          </div>
                          <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                            {formatCurrency(price, currency)}
                          </div>
                          
                          {/* Stepper */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-pink-400 hover:bg-pink-500/10 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Promo code input */}
              {cart.length > 0 && (
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. LAUNCH50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Coupon feedback */}
                  {couponFeedback && (
                    <div className={`mt-2 p-2 rounded-xl text-xs flex items-center gap-1.5 ${
                      couponFeedback.success ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/15 text-red-300 border border-red-500/30'
                    }`}>
                      {couponFeedback.success ? <Check className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span>{couponFeedback.message}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span>(-{appliedCoupon.discountPercent}%)</span>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        className="text-slate-400 hover:text-pink-400 text-[10px] font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: MULTI-GATEWAY CHECKOUT VIEW */}
          {step === 'checkout' && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Payment Gateway Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Payment Gateway
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('jazzcash')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedGateway === 'jazzcash'
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-400 font-extrabold mb-1">
                      <Smartphone className="w-4 h-4" />
                      <span>JazzCash Mobile</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Instant MPIN / OTP</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('easypaisa')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedGateway === 'easypaisa'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold mb-1">
                      <Smartphone className="w-4 h-4" />
                      <span>EasyPaisa Wallet</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Direct In-App Prompt</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('card')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedGateway === 'card'
                        ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Debit / Credit Card</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Visa, Mastercard, Amex</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('crypto')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedGateway === 'crypto'
                        ? 'bg-purple-500/20 border-purple-400 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-purple-400 font-extrabold mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Crypto (USDT/BTC)</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Instant On-Chain Verify</div>
                  </button>
                </div>
              </div>

              {/* Gateway-specific Form */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Your Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email for Key Delivery</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {(selectedGateway === 'jazzcash' || selectedGateway === 'easypaisa') && (
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      {selectedGateway === 'jazzcash' ? 'JazzCash Mobile Account Number' : 'EasyPaisa Account Number'}
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {selectedGateway === 'card' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">CVC / CVV</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedGateway === 'crypto' && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-purple-400" />
                      <span>USDT TRC-20 & BEP-20 Auto-Scan</span>
                    </div>
                    <p className="text-[11px] text-purple-300">
                      Payment confirms automatically on the blockchain within 12 seconds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: POST-PURCHASE SUCCESS VIEW */}
          {step === 'success' && completedOrder && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-black text-white text-base">Payment Verified & Dispatched!</h4>
                <p className="text-slate-300 text-xs">
                  Order <span className="font-mono text-emerald-400 font-bold">{completedOrder.orderNumber}</span> has been completed.
                </p>
              </div>

              {/* License Keys Vault Box */}
              <div className="space-y-3">
                <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Generated License Keys</span>
                  <span className="text-[10px] text-indigo-400">Vault Encrypted</span>
                </div>

                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                    <div className="font-semibold text-white truncate">{item.product.title}</div>
                    
                    {item.licenseKeys.map((key, kIdx) => (
                      <div key={kIdx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                        <span className="text-emerald-400 font-bold select-all">{key}</span>
                        <button
                          onClick={() => handleCopyKey(key)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="Copy license key"
                        >
                          {copiedKey === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}

                    {item.downloadUrl && (
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold pt-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Software Package ({item.product.fileSize || 'Direct'})
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Transaction Receipt Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Transaction Ref:</span>
                  <span className="font-mono text-slate-200">{completedOrder.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Via:</span>
                  <span className="font-bold text-slate-200 uppercase">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivered To:</span>
                  <span className="font-semibold text-slate-200">{completedOrder.customerEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Totals and Checkout CTA */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {step !== 'success' && (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cartSubtotalPKR, currency)}</span>
                </div>
                
                {cartDiscountPKR > 0 && (
                  <div className="flex justify-between text-pink-400 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-{formatCurrency(cartDiscountPKR, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-white pt-1 border-t border-slate-800/60">
                  <span>Total Amount:</span>
                  <span className="text-base text-emerald-400">
                    {formatCurrency(cartFinalTotalPKR, currency)}
                  </span>
                </div>
              </div>
            )}

            {step === 'cart' && (
              <button
                disabled={cart.length === 0}
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 font-bold text-xs sm:text-sm text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'checkout' && (
              <div className="space-y-2">
                <button
                  disabled={isProcessing}
                  onClick={handleCompletePayment}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 font-bold text-xs sm:text-sm text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Verifying with {selectedGateway.toUpperCase()}...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay & Receive Instant Keys ({formatCurrency(cartFinalTotalPKR, currency)})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('cart')}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Return to Cart
                </button>
              </div>
            )}

            {step === 'success' && (
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-all cursor-pointer"
              >
                Done & Return to Store
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
