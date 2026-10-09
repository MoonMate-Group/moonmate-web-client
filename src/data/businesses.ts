/**
 * Single source of truth for group businesses.
 * To add a future company or acquisition, append an entry here —
 * the nav, homepage, /businesses index and /businesses/[slug] page update automatically.
 */

export type BusinessStatus = "Operational" | "Planned venture" | "Long-term concept";

export type IconName = "chart" | "shield" | "factory" | "moon";

export interface Business {
  slug: string;
  code: string;
  name: string;
  short: string;
  status: BusinessStatus;
  icon: IconName;
  tagline: string;
  summary: string;
  capabilities: { title: string; body: string }[];
  statusNote: string;
  outlook: string[];
}

export const STATUS_DESCRIPTIONS: Record<BusinessStatus, string> = {
  Operational: "Active business with live capability and engagements.",
  "Planned venture": "Committed venture in structured development and partnership building.",
  "Long-term concept": "Frontier initiative under study, with a multi-decade horizon.",
};

export const businesses: Business[] = [
  {
    slug: "financial-decision-intelligence",
    code: "01",
    name: "Financial Decision Intelligence",
    short: "Financial Intelligence",
    status: "Operational",
    icon: "chart",
    tagline: "AI-powered decision infrastructure for financial systems.",
    summary:
      "We build the intelligence layer behind high-stakes financial decisions — turning claims, payments and benefit flows into verifiable, automated, auditable workflows for institutions and governments.",
    capabilities: [
      { title: "Automated insurance claims & settlements", body: "End-to-end claims assessment and settlement workflows that reduce cycle times while preserving oversight." },
      { title: "Intelligent banking & payment workflows", body: "Decision automation across onboarding, transaction review and exception handling." },
      { title: "Subsidy & benefit distribution", body: "Transparent, traceable delivery of government subsidies and entitlements to intended beneficiaries." },
      { title: "Risk assessment & verification", body: "Evidence-based risk scoring and identity and document verification at institutional scale." },
      { title: "Financial process automation", body: "Governed automation that keeps humans accountable for consequential outcomes." },
    ],
    statusNote: "Operational vertical serving institutional and public-sector use cases.",
    outlook: ["Insurers and financial institutions", "Public-sector benefit programmes", "Payments and banking infrastructure"],
  },
  {
    slug: "defence-ai-autonomous-intelligence",
    code: "02",
    name: "Defence AI & Autonomous Intelligence",
    short: "Defence AI",
    status: "Operational",
    icon: "shield",
    tagline: "Sovereign AI for defence, built to operate where connectivity cannot be assumed.",
    summary:
      "We develop sovereign artificial intelligence for defence organisations — from domain-specific language models to decision-support and operational intelligence — deployed on infrastructure our partners control.",
    capabilities: [
      { title: "Sovereign AI for defence", body: "AI that is developed, hosted and governed within national and institutional boundaries." },
      { title: "Defence-specific Small Language Models", body: "Compact, domain-tuned models designed for secure, resource-aware deployment." },
      { title: "Decision-support systems", body: "AI-assisted analysis that augments commanders and analysts, never replaces accountable judgement." },
      { title: "Predictive maintenance & operational intelligence", body: "Readiness-focused insight across fleets, equipment and logistics." },
      { title: "Secure, air-gapped infrastructure", body: "Isolated deployment architectures for the most sensitive environments." },
    ],
    statusNote: "Operational vertical engaging with defence and security stakeholders.",
    outlook: ["Armed forces and defence agencies", "Defence research organisations", "Prime and tier-one contractors"],
  },
  {
    slug: "ammunition-advanced-manufacturing",
    code: "03",
    name: "Ammunition & Advanced Manufacturing",
    short: "Advanced Manufacturing",
    status: "Planned venture",
    icon: "factory",
    tagline: "Indigenous precision manufacturing for strategic industries.",
    summary:
      "Moonmate Group is planning an advanced manufacturing venture focused on ammunition and defence production, built on precision engineering and long-term technology partnerships.",
    capabilities: [
      { title: "Ammunition & defence production", body: "A planned capability for manufacturing to defence-grade standards." },
      { title: "Precision engineering", body: "Advanced manufacturing processes, quality systems and process control." },
      { title: "Indigenous manufacturing capability", body: "Building domestic industrial depth and supply-chain resilience." },
      { title: "R&D and strategic partnerships", body: "Collaboration with research institutions and established manufacturers." },
    ],
    statusNote: "Planned venture. Timelines, licences and partnerships are subject to regulatory approvals.",
    outlook: ["Strategic manufacturing partners", "Technology and process licensors", "Government and institutional customers"],
  },
  {
    slug: "space-hospitality-lunar-infrastructure",
    code: "04",
    name: "Space Hospitality & Lunar Infrastructure",
    short: "Space & Lunar",
    status: "Long-term concept",
    icon: "moon",
    tagline: "Imagining hospitality and habitation beyond Earth.",
    summary:
      "Our most forward-looking initiative explores the Moon Hotel — a vision for lunar hospitality — alongside the sustainable infrastructure and habitats that could make it possible.",
    capabilities: [
      { title: "Moon Hotel", body: "A long-term vision for lunar hospitality and accommodation." },
      { title: "Future space tourism", body: "Concept studies on accommodation and experiences for future space travellers." },
      { title: "Sustainable lunar infrastructure", body: "Conceptual work on resilient, resource-aware off-world infrastructure." },
      { title: "Space habitats", body: "Next-generation habitat and hospitality design thinking." },
      { title: "Exploration & development", body: "Positioning for long-term opportunities as the space economy matures." },
    ],
    statusNote: "Long-term concept. This is a vision and research initiative, not a commercial offering.",
    outlook: ["Space agencies and research bodies", "Architecture and habitat designers", "Long-horizon strategic investors"],
  },
];

export const getBusiness = (slug: string) => businesses.find((b) => b.slug === slug);
