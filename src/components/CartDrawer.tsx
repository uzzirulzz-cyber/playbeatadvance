import React, { useState } from 'react';
import { useStore } from '../store/useStore';
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
  Sparkles,
  Wallet,
  Building,
  Truck,
  FileText
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
    currency,
    storeSettings,
    user,
    setIsInvoiceModalOpen,
    setActiveInvoiceOrder,
    formatPKR
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  
  // Checkout flow states
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [selectedGateway, setSelectedGateway] = useState<Order['paymentMethod']>('jazzcash');
  
  // Customer details
  const [customerName, setCustomerName] = useState(user.name || 'Valued Customer');
  const [customerEmail, setCustomerEmail] = useState(user.email || 'customer@playbeat.digital');
  const [customerPhone, setCustomerPhone] = useState('03321029333');
  const [shippingAddress, setShippingAddress] = useState('House 42, Street 8, DHA Phase 6, Karachi, Pakistan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const hasHardware = cart.some(i => i.product.type === 'HARDWARE');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleCompletePayment = () => {
    if (selectedGateway === 'wallet' && (user.balancePKR || 0) < cartFinalTotalPKR) {
      alert('Insufficient wallet credits! Please top up your wallet or select another gateway.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const order = processCheckout(selectedGateway, {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: hasHardware ? shippingAddress : undefined
      });
      setCompletedOrder(order);
      setIsProcessing(false);
      setStep('success');
    }, 1000);
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b1120] border-l border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-yellow-400/10 text-[#fcb800] flex items-center justify-center font-bold border border-yellow-400/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {step === 'cart' ? 'Your Shopping Cart' : step === 'checkout' ? 'Multi-Gateway Checkout' : 'Payment Confirmed!'}
                </h3>
                <span className="text-xs text-slate-400">
                  {step === 'cart' ? `${cartTotalCount} item(s) selected` : step === 'checkout' ? 'Select payment method' : 'Instant digital fulfillment'}
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
                    Explore our digital marketplace for Netflix passes, AI tools, 4K smart cinema projectors, and Windows 11 keys.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => {
                    const price = item.selectedVariant?.price ?? item.product.discountPrice ?? item.product.price;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#070b14] border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                            {item.product.cover?.image ? (
                              <img src={item.product.cover.image} alt={item.product.title} className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-[#fcb800]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-white truncate max-w-[170px]">{item.product.title}</h4>
                            {item.selectedVariant && (
                              <div className="text-[10px] text-yellow-400 font-bold">{item.selectedVariant.name}</div>
                            )}
                            <div className="text-[#fcb800] font-mono font-bold mt-0.5">
                              {formatPKR(price)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity & Delete */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-xs"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-white text-[11px]">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT VIEW */}
          {step === 'checkout' && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Customer Contact Details */}
              <div className="p-3.5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2.5">
                <span className="font-bold text-white text-xs block">Contact Information</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <input
                  type="email"
                  placeholder="Email Address (for key delivery)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile Number (e.g. 03321029333)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
                {hasHardware && (
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Projector Courier Dispatch Address (Pakistan):</span>
                    </span>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Complete street address & city..."
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Payment Gateway Selector */}
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">Select Payment Method:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'jazzcash' as const, label: 'JazzCash', sub: '03321029333' },
                    { id: 'easypaisa' as const, label: 'Easypaisa', sub: '03321029333' },
                    { id: 'bank_transfer' as const, label: 'Meezan Bank Wire', sub: 'Instant IBAN' },
                    { id: 'raast' as const, label: 'Raast Pay ID', sub: '03321029333' },
                    { id: 'card' as const, label: 'Visa / Mastercard', sub: 'Stripe 3D-Secure' },
                    { id: 'wallet' as const, label: 'Store Wallet', sub: `Balance: Rs ${(user.balancePKR || 0).toLocaleString()}` },
                  ].map(gw => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedGateway === gw.id
                          ? 'bg-yellow-400/10 border-[#fcb800] text-white shadow-md'
                          : 'bg-[#070b14] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{gw.label}</div>
                      <div className="text-[10px] text-slate-400">{gw.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Gateway Specific Payment Details */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                  {selectedGateway === 'jazzcash' && (
                    <>
                      <div className="font-bold text-white">JazzCash Merchant Details:</div>
                      <div className="text-slate-300">Account Title: <strong>PlayBeat Digital Merchant</strong></div>
                      <div className="text-yellow-400 font-mono font-bold">Number: 0332 1029333</div>
                    </>
                  )}
                  {selectedGateway === 'easypaisa' && (
                    <>
                      <div className="font-bold text-white">Easypaisa Account Details:</div>
                      <div className="text-slate-300">Account Title: <strong>PlayBeat Digital Official</strong></div>
                      <div className="text-yellow-400 font-mono font-bold">Number: 0332 1029333</div>
                    </>
                  )}
                  {selectedGateway === 'bank_transfer' && (
                    <>
                      <div className="font-bold text-white">Meezan Bank Official Account:</div>
                      <div className="text-slate-300">Title: <strong>PlayBeat Digital Store</strong></div>
                      <div className="text-slate-300">Account #: <strong>02890104829102</strong></div>
                      <div className="text-yellow-400 font-mono font-bold">IBAN: PK49MEZN0002890104829102</div>
                    </>
                  )}
                  {selectedGateway === 'raast' && (
                    <>
                      <div className="font-bold text-white">Raast Instant ID (0% Fees):</div>
                      <div className="text-yellow-400 font-mono font-bold">Raast ID: 03321029333</div>
                    </>
                  )}
                  {selectedGateway === 'card' && (
                    <>
                      <div className="font-bold text-white">Stripe Card Gateway:</div>
                      <div className="text-slate-400">Card will be charged automatically via 256-bit SSL encrypted checkout.</div>
                    </>
                  )}
                  {selectedGateway === 'wallet' && (
                    <>
                      <div className="font-bold text-white">PlayBeat Store Balance:</div>
                      <div className="text-slate-300">Available: <strong className="text-emerald-400">{formatPKR(user.balancePKR || 0)}</strong></div>
                      <div className="text-slate-400">Order will be deducted instantly from your balance.</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS VIEW */}
          {step === 'success' && completedOrder && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white text-base">Payment Verified!</h4>
                <p className="text-slate-400 text-xs">
                  Your order <span className="font-mono text-emerald-400 font-bold">{completedOrder.orderNumber}</span> has been confirmed.
                </p>
              </div>

              {/* Digital License Keys Vault Box */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs block">Your Instant License Keys:</span>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2">
                    <div className="font-bold text-white">{item.product.title}</div>
                    {item.licenseKeys && item.licenseKeys.map((key, kidx) => (
                      <div key={kidx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <code className="text-yellow-400 font-mono font-bold text-xs">{key}</code>
                        <button
                          onClick={() => handleCopyKey(key)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === key ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    ))}
                    <p className="text-[11px] text-slate-400">{item.instructions}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setActiveInvoiceOrder(completedOrder);
                    setIsInvoiceModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#fcb800]" />
                  <span>View & Print Official Invoice</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          {step === 'cart' && cart.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              {/* Coupon Bar */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. PLAYBEAT20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700 text-white text-xs uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <div className={`text-[11px] font-bold ${couponFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponFeedback.message}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatPKR(cartSubtotalPKR)}</span>
                </div>
                {cartDiscountPKR > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span className="font-mono">-{formatPKR(cartDiscountPKR)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-black text-white">
                  <span>Total:</span>
                  <span className="text-[#fcb800] font-mono">{formatPKR(cartFinalTotalPKR)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-2xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'checkout' && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-sm font-black text-white mb-2">
                <span>Total Due:</span>
                <span className="text-[#fcb800] font-mono">{formatPKR(cartFinalTotalPKR)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer transition-all active:scale-95"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Confirm & Pay ({selectedGateway.toUpperCase()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-[#fcb800] text-slate-950 font-black text-xs cursor-pointer shadow-md"
              >
                Done / Back to Store
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
