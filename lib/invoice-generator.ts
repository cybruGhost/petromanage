import { formatCurrency, formatDate } from "./local-storage"
import type { Order, Payment, User } from "./local-storage"

export const generateInvoicePDF = (order: Order, payment?: Payment, user?: Omit<User, "password">) => {
  // Create a new window for the invoice
  const invoiceWindow = window.open("", "_blank")
  if (!invoiceWindow) {
    alert("Please allow popups to view the invoice")
    return
  }

  // Format the order date
  const orderDate = formatDate(order.createdAt)

  // Calculate totals
  const subtotal = order.total
  const tax = 0 // In a real app, you would calculate tax
  const total = subtotal + tax

  // Create the invoice HTML
  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${order.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
        }
        .invoice-details {
          margin-bottom: 40px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .invoice-table th {
          background-color: #f9fafb;
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .invoice-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        .text-right {
          text-align: right;
        }
        .invoice-total {
          margin-top: 30px;
          margin-left: auto;
          width: 300px;
        }
        .invoice-total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .invoice-total-row.final {
          font-weight: bold;
          font-size: 18px;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
        .invoice-notes {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .invoice-footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        @media print {
          .no-print {
            display: none;
          }
          body {
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
            border: none;
          }
        }
        .btn {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button class="btn" onclick="window.print()">Print Invoice</button>
        <button class="btn" onclick="window.close()">Close</button>
      </div>
      
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>PetroManage Inc.</div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: bold;">Invoice #${order.id}</div>
            <div>Date: ${orderDate}</div>
          </div>
        </div>
        
        <div class="invoice-details">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div style="font-weight: bold; margin-bottom: 8px;">From:</div>
              <div>PetroManage Inc.</div>
              <div>123 Business Street</div>
              <div>City, State 12345</div>
              <div>Phone: (555) 123-4567</div>
              <div>Email: info@petromanage.com</div>
            </div>
            
            <div>
              <div style="font-weight: bold; margin-bottom: 8px;">To:</div>
              <div>${order.customerName}</div>
              <div style="white-space: pre-line;">${order.shippingAddress}</div>
              ${user?.email ? `<div>Email: ${user.email}</div>` : ""}
              ${user?.phone ? `<div>Phone: ${user.phone}</div>` : ""}
            </div>
          </div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="invoice-total">
          <div class="invoice-total-row">
            <div>Subtotal:</div>
            <div>${formatCurrency(subtotal)}</div>
          </div>
          <div class="invoice-total-row">
            <div>Tax:</div>
            <div>${formatCurrency(tax)}</div>
          </div>
          <div class="invoice-total-row final">
            <div>Total:</div>
            <div>${formatCurrency(total)}</div>
          </div>
        </div>
        
        <div class="invoice-notes">
          <div style="font-weight: bold; margin-bottom: 8px;">Payment Information:</div>
          ${
            payment
              ? `
            <div>Method: ${
              payment.method === "credit_card"
                ? "Credit Card"
                : payment.method === "bank_transfer"
                  ? "Bank Transfer"
                  : "Cash on Delivery"
            }</div>
            <div>Status: ${payment.status}</div>
            ${payment.transactionId ? `<div>Transaction ID: ${payment.transactionId}</div>` : ""}
          `
              : "<div>No payment information available</div>"
          }
          
          ${
            order.notes
              ? `
            <div style="margin-top: 20px; font-weight: bold;">Notes:</div>
            <div>${order.notes}</div>
          `
              : ""
          }
        </div>
        
        <div class="invoice-footer">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Write the HTML to the new window
  invoiceWindow.document.write(invoiceHTML)
  invoiceWindow.document.close()
}
