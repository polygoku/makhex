/**
 * MAKHEX purchase-release ledger. NEVER add an item without exact supplier and
 * Squarespace checkout evidence. This is intentionally empty at launch.
 * Provider order/customer identifiers and credentials do not belong here.
 */
export interface CheckoutApproval {
  provider: 'squarespace';
  publicPath: string;
  merchantSku: string;
  evidenceIssueUrl: string;
  checkedAt: string; // ISO 8601 time of verification
  supplierVariantVerified: true;
  shippingAndReturnsVerified: true;
  checkoutAndFulfillmentTested: true;
}
export const checkoutApprovals: Readonly<Record<string,CheckoutApproval>> = Object.freeze({});
