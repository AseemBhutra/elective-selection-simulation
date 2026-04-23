// PGDM Program Configuration
export const pgdmConfig = {
  programName: "PGDM",
  totalElectives: 11,
  terms: [4, 5, 6],

  termLimits: {
    4: { min: 5, max: 5 },
    5: { min: 3, max: 3 },
    6: { min: 3, max: 3 }
  },

  majorCategories: [
    { name: "Marketing", color: "#FF9999" },
    { name: "Finance", color: "#99FF99" },
    { name: "Operations", color: "#FFFF99" },
    { name: "HR", color: "#FF99FF" },
    { name: "Analytics", color: "#FFCC99" },
    { name: "Open Elective", color: "#A9A9A9" }
  ],

  functionalAreas: ["Marketing", "Finance", "Operations", "Analytics", "HR"],

  specialization: {
    majorThreshold: 6,
    minorThreshold: 3,
    generalManagementThreshold: 2
  },

  // false = exact required count per term
  usesRangeLimits: false,

  prerequisites: {
    "Deep Learning & Natural Language Processing": ["Machine Learning"]
  },

  dependentCourses: {
    "Machine Learning": ["Deep Learning & Natural Language Processing"]
  },

  mutuallyExclusive: [],

  requireOpenElective: false,

  electivesData: {
    4: [
      { name: "Business Intelligence", major: "Analytics", color: "#FFCC99", credits: 3 },
      { name: "Fintech", major: "Analytics, Finance", color: "#99FF99", crossListed: true, credits: 3 },
      { name: "Machine Learning", major: "Analytics", color: "#FFCC99", credits: 3 },
      { name: "Marketing & Retail Analytics", major: "Analytics, Marketing", color: "#FFCC99", crossListed: true, credits: 3 },
      { name: "Financial Statement Analysis & Valuation", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Security Analysis & Portfolio Management", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Wealth Management", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Strategic Negotiation", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
      { name: "Talent Acquisition through Employee Value Proposition", major: "HR", color: "#FF99FF", credits: 3 },
      { name: "Total Rewards for Retaining Talents", major: "HR", color: "#FF99FF", credits: 3 },
      { name: "Consumer Behaviour", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Digital Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Sales & Distribution Management", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Enterprise Resources Planning", major: "Operations", color: "#FFFF99", credits: 3 },
      { name: "Project Management", major: "Operations", color: "#FFFF99", credits: 3 },
      { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99", credits: 3 }
    ],
    5: [
      { name: "Deep Learning & Natural Language Processing", major: "Analytics", color: "#FFCC99", credits: 3 },
      { name: "Web and Social Media Analytics", major: "Analytics, Marketing", color: "#FFCC99", crossListed: true, credits: 3 },
      { name: "Derivatives & Financial Risk Management", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Financial Management for Developing Marketing Strategy", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Creating High Performance and Agile Organization", major: "HR", color: "#FF99FF", credits: 3 },
      { name: "Emotionally Intelligent Leadership", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
      { name: "B2B Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Product & Brand Management", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99", credits: 3 },
      { name: "Supply Chain Management", major: "Operations", color: "#FFFF99", credits: 3 }
    ],
    6: [
      { name: "Big Data & Cloud Analytics for Managers", major: "Analytics", color: "#FFCC99", credits: 3 },
      { name: "Financial Risk Analytics", major: "Analytics", color: "#FFCC99", credits: 3 },
      { name: "HR Analytics", major: "Analytics, HR", color: "#FF99FF", crossListed: true, credits: 3 },
      { name: "Banking Management", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Behavioural Economics and Finance", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Project Finance", major: "Finance", color: "#99FF99", credits: 3 },
      { name: "Managing Business in an International Context", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
      { name: "CRM", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Integrated Marketing Communication", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Services Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
      { name: "Game Theory and Public Policy", major: "Open Elective", color: "#A9A9A9", credits: 3 },
      { name: "Demand Planning & Forecasting", major: "Operations, Analytics", color: "#FFFF99", crossListed: true, credits: 3 },
      { name: "Internet Business", major: "Operations", color: "#FFFF99", credits: 3 },
      { name: "Service Operations", major: "Operations", color: "#FFFF99", credits: 3 }
    ]
  }
};
