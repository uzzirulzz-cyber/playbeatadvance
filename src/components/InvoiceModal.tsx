import React from 'react';
import { useStore } from '../store/useStore';
import { Printer, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

export const InvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, activeInvoiceOrder, storeSettings, formatPKR } = useStore();

  if (!isInvoiceModalOpen || !activeInvoiceOrder) return null;

  const order: Order = activeInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-[#0b1120] print:bg-white text-slate-100 print:text-black border border-slate-800 print:border-none rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] print:max-h-none">
        
        {/* Header Actions (hidden on print) */}
        <div className="flex items-center justify-between p-4 bg-[#070b14] border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Official Commercial Invoice</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-yellow-400/10 text-[#fcb800] border border-yellow-400/20">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0" id="printable-invoice">
          
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 print:border-slate-300 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-[#fcb800] text-black font-black flex items-center justify-center text-base">
                  PB
                </div>
                <h1 className="text-xl font-black tracking-tight text-white print:text-black">
                  PlayBeat Digital
                </h1>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600">
                playbeat.digital • support@playbeat.digital • +92 332 1029333
              </p>
              <p className="text-[11px] text-slate-500 print:text-slate-500">
                Official Digital Commerce & Cinema Projector Marketplace
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-2xl font-black text-[#fcb800] print:text-black font-mono">INVOICE</span>
              <div className="text-xs text-slate-300 print:text-slate-700">
                <strong>Invoice #:</strong> {order.orderNumber}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                <strong>Status:</strong> <span className="text-emerald-400 print:text-green-700 font-bold">{order.paymentStatus || 'PAID'}</span>
              </div>
            </div>
          </div>

          {/* Billed To & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Billed To:</span>
              <div className="font-bold text-white print:text-black text-sm">{order.customerName}</div>
              <div className="text-slate-400 print:text-slate-600">{order.customerEmail}</div>
              {order.customerPhone && <div className="text-slate-400 print:text-slate-600">{order.customerPhone}</div>}
              {order.shippingAddress && (
                <div className="text-slate-400 print:text-slate-600 pt-1">
                  <strong>Courier Address:</strong> {order.shippingAddress}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Payment Information:</span>
              <div className="font-bold text-white print:text-black text-sm">
                Method: {order.paymentMethod.toUpperCase()}
              </div>
              <div className="text-slate-400 print:text-slate-600">
                Transaction Ref: {order.transactionRef}
              </div>
              <div className="flex items-center gap-1 text-emerald-400 print:text-green-700 text-[11px] font-bold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by PlayBeat Payment Gateway</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-800 print:border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070b14] print:bg-slate-100 text-slate-400 print:text-slate-700 font-bold border-b border-slate-800 print:border-slate-300">
                <tr>
                  <th className="p-3.5">Item Description</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Unit Price</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {order.items.map((item, idx) => {
                  const unitPrice = item.unitPrice || item.product.price;
                  const total = unitPrice * item.quantity;
                  return (
                    <tr key={idx} className="hover:bg-slate-900/30 print:hover:bg-transparent">
                      <td className="p-3.5 space-y-1">
                        <div className="font-bold text-white print:text-black">{item.product.title}</div>
                        {item.variantName && (
                          <span className="text-[10px] text-yellow-400 print:text-yellow-700 font-bold">
                            Plan: {item.variantName}
                          </span>
                        )}
                        {item.licenseKeys && item.licenseKeys.length > 0 && (
                          <div className="text-[10px] font-mono text-slate-400 print:text-slate-600">
                            Serial: {item.licenseKeys.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-300 print:text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-300 print:text-slate-700">
                        Rs {unitPrice.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-white print:text-black">
                        Rs {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">Rs {(order.subtotal || order.totalAmountPKR).toLocaleString()}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-green-700 font-bold">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">-Rs {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Tax (0%):</span>
                <span className="font-mono">Rs 0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 print:border-slate-300 text-sm font-black text-[#fcb800] print:text-black">
                <span>Total Amount:</span>
                <span className="font-mono">{formatPKR(order.totalAmountPKR)}</span>
              </div>
            </div>
          </div>

          {/* Footer Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-900/40 print:bg-slate-100 border border-slate-800 print:border-slate-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 print:text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#fcb800]" />
              <span>100% Genuine Verified Product & Warranty Guarantee</span>
            </div>
            <p className="text-[10px] text-slate-500 print:text-slate-500">
              For warranty claims, technical setup, or invoice queries, contact WhatsApp: +92 332 1029333 or email support@playbeat.digital.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
