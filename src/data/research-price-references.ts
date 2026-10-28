/**
 * Customer-visible, NON-orderable historical supplier reference estimates.
 * This is separate from the 16 Squarespace-exported merchant price records.
 * Never store supplier item IDs, wholesale offers, credentials or stock API
 * details in public website artifacts.
 *
 * Radxa ZERO 3W manufacturer SKU RS107-D2E0H1W15:
 * - 2 GB RAM, no eMMC, populated 40-pin header.
 * - Dated source-specific offer was observed on 2026-10-25.
 * - That exact option was out of stock, and ZIP 11021 checkout was unverified.
 * - Price below is a 2.5x retail PLANNING ESTIMATE only, not a sales offer.
 */
export interface ResearchPriceReference {
  supplierModel: string;
  title: string;
  estimatedRetailUsd: number;
  asOf: string;
  inventory: 'OUT_OF_STOCK';
}
export const researchPriceReferences:Readonly<Record<string,ResearchPriceReference>>={
  'radxa-zero-3w':{
    supplierModel:'Radxa ZERO 3W, 2 GB / no eMMC / GPIO header',
    title:'2 GB RAM · no eMMC · pre-soldered GPIO · RS107-D2E0H1W15',
    estimatedRetailUsd:271.98,
    asOf:'2026-10-25',
    inventory:'OUT_OF_STOCK',
  },
} as const;
export const researchPriceReferenceFor=(slug:string):ResearchPriceReference|undefined=>researchPriceReferences[slug];
