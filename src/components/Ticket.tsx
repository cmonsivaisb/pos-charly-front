'use client';

import React from 'react';

interface TicketProps {
  cart: any[];
  total: number;
  paymentMethod: string;
  userEmail: string;
}

export const Ticket = React.forwardRef<HTMLDivElement, TicketProps>(({ cart, total, paymentMethod, userEmail }, ref) => {
  const date = new Date().toLocaleString();
  
  return (
    <div ref={ref} id="printable-ticket" className="bg-white text-black p-4 font-mono text-[10px] w-[80mm]">
      <div className="text-center mb-4">
        <h1 className="text-sm font-bold uppercase">RetailPOS</h1>
        <p>Terminal de Venta</p>
        <p className="mt-1">{date}</p>
      </div>
      
      <div className="border-b border-black border-dashed mb-2 pb-1 flex justify-between font-bold">
        <span>Producto</span>
        <div className="flex gap-4">
          <span className="w-8 text-right">Cant</span>
          <span className="w-16 text-right">Total</span>
        </div>
      </div>
      
      <div className="space-y-1 mb-4">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="truncate flex-1 pr-2">{item.name}</span>
            <div className="flex gap-4 shrink-0">
              <span className="w-8 text-right">x{item.quantity}</span>
              <span className="w-16 text-right">${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-black border-dashed pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${(Number(total || 0) * 0.84).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (16%):</span>
          <span>${(Number(total || 0) * 0.16).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-xs pt-1">
          <span>TOTAL:</span>
          <span>${Number(total || 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-black border-dashed">
        <p>Método de Pago: {paymentMethod === 'CASH' ? 'EFECTIVO' : 'TARJETA'}</p>
        <p>Atendió: {userEmail}</p>
      </div>
      
      <div className="text-center mt-6">
        <p className="uppercase font-bold">¡Gracias por su compra!</p>
      </div>
    </div>
  );
});

Ticket.displayName = 'Ticket';
