const APP_URL = "https://remoteworkhub.org";

const organizationSchema = {
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: "Doctor Barns Tech",
  alternateName: "Remote Work Hub",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/icon`,
    width: 180,
    height: 180,
  },
  sameAs: [
    "https://twitter.com/remoteworkhub",
    "https://www.facebook.com/remoteworkhub",
    "https://www.linkedin.com/company/remoteworkhub",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+233209636158",
    contactType: "customer service",
    areaServed: "GH",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "111 Newtown RD",
    addressLocality: "Accra Newtown",
    addressCountry: "GH",
  },
};

const courseSchema = {
  "@type": "Course",
  "@id": `${APP_URL}/#course`,
  name: "2026 Elite Web Development & SaaS Masterclass",
  description:
    "An intensive 30-day offline web development masterclass in Accra, Ghana. Learn to build production-ready web applications, e-commerce platforms, dashboards, and SaaS products. Includes a 1-month paid internship at Doctor Barns Tech. Top 2 students get hired. Every student lands their first paying client before graduation.",
  url: `${APP_URL}/apply`,
  provider: { "@id": `${APP_URL}/#organization` },
  courseCode: "RWH-2026-ELITE",
  educationalLevel: "Beginner to Professional",
  teaches: [
    "Full-stack web development",
    "Next.js and React",
    "Supabase and database architecture",
    "Payment integration (Paystack, Moolre)",
    "E-commerce development",
    "Dashboard and admin panel engineering",
    "Client acquisition and freelancing",
    "Agency branding and pricing",
  ],
  numberOfCredits: 1,
  occupationalCredentialAwarded: "Diploma Certification in Web Development",
  timeRequired: "P30D",
  hasCourseInstance: {
    "@type": "CourseInstance",
    name: "March 2026 Cohort",
    startDate: "2026-03-16",
    endDate: "2026-04-15",
    courseMode: "Offline",
    courseWorkload: "PT8H",
    instructor: {
      "@type": "Person",
      name: "Doctor Barns",
      jobTitle: "Lead Instructor & CEO",
      worksFor: { "@id": `${APP_URL}/#organization` },
    },
    location: {
      "@type": "Place",
      name: "Doctor Barns Tech HQ",
      address: {
        "@type": "PostalAddress",
        streetAddress: "111 Newtown RD",
        addressLocality: "Accra Newtown",
        addressCountry: "GH",
      },
    },
    offers: {
      "@type": "Offer",
      price: "1000",
      priceCurrency: "GHS",
      availability: "https://schema.org/LimitedAvailability",
      url: `${APP_URL}/apply`,
      validFrom: "2026-01-01",
      validThrough: "2026-03-16",
      category: "Web Development Training",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "47",
    reviewCount: "32",
  },
  inLanguage: "en",
  isAccessibleForFree: false,
};

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${APP_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need any prior coding experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This masterclass is designed for absolute beginners. We take you from zero to building production-ready web applications in 30 days. All you need is a laptop, dedication, and the willingness to learn.",
      },
    },
    {
      "@type": "Question",
      name: "What exactly will I be able to build after the masterclass?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You will build corporate websites, e-commerce platforms with payment integration, management dashboards (school, hotel, hospital, POS systems), CRM tools, and full SaaS products. These are the exact systems that businesses pay thousands of Cedis for.",
      },
    },
    {
      "@type": "Question",
      name: "Is the first client really guaranteed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We have a dedicated client acquisition module where you learn lead generation, pitching, and closing. We work with every student individually to ensure you sign your first paying web design client before the program ends.",
      },
    },
    {
      "@type": "Question",
      name: "What is the 100K in 2 Weeks Challenge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's our client generation challenge where students learn to find, pitch, and close high-paying corporate clients. The goal is to help you generate GHS 100,000 worth of contracts within 2 weeks of completing the program using our proven outreach systems.",
      },
    },
    {
      "@type": "Question",
      name: "How does the paid internship work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After the 30-day masterclass, every student transitions into a 1-month paid internship at Doctor Barns Tech. You'll work on real client projects alongside senior developers, building your portfolio and professional experience.",
      },
    },
    {
      "@type": "Question",
      name: "What does 'Top 2 Get Hired' mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The two highest-performing students in the cohort will receive a full-time job offer from Doctor Barns Tech. Performance is evaluated based on project quality, initiative, and client work during the program.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pay in installments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can start with a 20% deposit (GHS 200), a 50% payment (GHS 500), or pay the full GHS 1,000 upfront. All payment tiers secure your seat immediately.",
      },
    },
    {
      "@type": "Question",
      name: "What tech stack will I learn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll master Next.js (React), TypeScript, Tailwind CSS, Supabase (PostgreSQL), authentication systems, payment gateways (Paystack, Moolre), and deployment. This is the same modern stack used by top startups worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Is the training online or offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The masterclass is fully offline and in-person at our training facility at 111 Newtown RD, Accra Newtown. This ensures hands-on mentorship, peer collaboration, and zero distractions.",
      },
    },
    {
      "@type": "Question",
      name: "What do I get at the end of the program?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You receive a Diploma Certification in Web Development, a professional portfolio of real projects, your first paying client, a 1-month paid internship, access to our alumni network, and a chance to be hired full-time by Doctor Barns Tech.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "Apply", item: `${APP_URL}/apply` },
  ],
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  url: APP_URL,
  name: "Remote Work Hub",
  description: "Elite Web Development & SaaS Masterclass by Doctor Barns Tech — Accra, Ghana",
  publisher: { "@id": `${APP_URL}/#organization` },
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const eventSchema = {
  "@type": "EducationEvent",
  name: "2026 Elite Web Development & SaaS Masterclass",
  description:
    "30-day intensive offline web development training in Accra. Learn to build real business applications, get a paid internship, and land your first client.",
  startDate: "2026-03-16T09:00:00+00:00",
  endDate: "2026-04-15T17:00:00+00:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Doctor Barns Tech HQ",
    address: {
      "@type": "PostalAddress",
      streetAddress: "111 Newtown RD",
      addressLocality: "Accra Newtown",
      addressCountry: "GH",
    },
  },
  organizer: { "@id": `${APP_URL}/#organization` },
  performer: {
    "@type": "Person",
    name: "Doctor Barns",
  },
  offers: {
    "@type": "Offer",
    price: "1000",
    priceCurrency: "GHS",
    availability: "https://schema.org/LimitedAvailability",
    url: `${APP_URL}/apply`,
    validFrom: "2026-01-01",
  },
  image: `${APP_URL}/opengraph-image`,
  inLanguage: "en",
};

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      organizationSchema,
      courseSchema,
      eventSchema,
      faqSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
