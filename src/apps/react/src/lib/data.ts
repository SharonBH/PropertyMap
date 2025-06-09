import { AgencyResponse, NeighborhoodResponse } from "@/api/homemapapi";

export interface Property {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  features: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agentId: string;
  createdAt: string;
  status: "active" | "sold" | "pending";
  soldDate?: string;
  soldPrice?: number;
  propertyTypeId?: string; // Added propertyTypeId field
  propertyStatusId?: string; // Added propertyStatusId field
}

export interface Review {
  id: string;
  agentId: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  propertyId?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  neighborhoods: NeighborhoodResponse[];
  overallRating?: number;
  agency: AgencyResponse; // Added agency field
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

// Mock Neighborhoods
/* export const neighborhoods: Neighborhood[] = [
  {
    id: "n1",
    name: "רמת אביב",
    description: "שכונה ירוקה בצפון תל אביב, קרובה לאוניברסיטה ולפארק הירקון",
    coordinates: {
      lat: 32.1133,
      lng: 34.7956,
    },
    zoom: 15,
  },
  {
    id: "n2",
    name: "נווה צדק",
    description: "שכונה היסטורית בדרום תל אביב, ידועה באדריכלות ייחודית",
    coordinates: {
      lat: 32.0636,
      lng: 34.7661,
    },
    zoom: 16,
  },
  {
    id: "n3",
    name: "רחביה",
    description: "שכונה יוקרתית במרכז ירושלים, ידועה באווירה השקטה והירוקה",
    coordinates: {
      lat: 31.7719,
      lng: 35.2167,
    },
    zoom: 15,
  },
  {
    id: "n4",
    name: "כרמל",
    description: "שכונה על הר הכרמל בחיפה, עם נוף מרהיב למפרץ חיפה",
    coordinates: {
      lat: 32.8068,
      lng: 34.9781,
    },
    zoom: 14,
  },
  {
    id: "n5",
    name: "פלורנטין",
    description: "שכונה היפסטרית בדרום תל אביב, מפורסמת באמנות רחוב ומסעדות בוטיק",
    coordinates: {
      lat: 32.0578,
      lng: 34.7705,
    },
    zoom: 16,
  },
  {
    id: "n6",
    name: "הדר הכרמל",
    description: "שכונה ססגונית בחיפה עם מבנים היסטוריים ושווקים תוססים",
    coordinates: {
      lat: 32.8103,
      lng: 34.9950,
    },
    zoom: 15,
  },
  {
    id: "n7",
    name: "בקעה",
    description: "שכונה ירושלמית עם קסם אותנטי, גינות קטנות ומדרחובים שקטים",
    coordinates: {
      lat: 31.7602,
      lng: 35.2280,
    },
    zoom: 15,
  },
]; */

// Mock Agents
/* export const agents: Agent[] = [
  {
    id: "a1",
    name: "יעל לוי",
    email: "yael@realestate.co.il",
    phone: "050-1234567",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    neighborhoods: ["n1", "n2", "n5"],
    overallRating: 4.8,
  },
  {
    id: "a2",
    name: "אלון כהן",
    email: "alon@realestate.co.il",
    phone: "052-7654321",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    neighborhoods: ["n3", "n4", "n6", "n7"],
    overallRating: 4.5,
  },
]; */

// Mock Reviews
export const reviews: Review[] = [
  {
    id: "r1",
    agentId: "a1",
    clientName: "דני ישראלי",
    rating: 5,
    comment: "יעל עזרה לנו למצוא את הדירה המושלמת ברמת אביב. היא הייתה מקצועית, זמינה וקשובה לצרכים שלנו.",
    propertyId: "p6",
    createdAt: "2023-08-10",
  },
  {
    id: "r2",
    agentId: "a1",
    clientName: "מיכל כהן",
    rating: 4,
    comment: "שירות מצוין ומקצועי. מומלץ בחום!",
    propertyId: "p7",
    createdAt: "2023-09-05",
  },
  {
    id: "r3",
    agentId: "a1",
    clientName: "אורי לוין",
    rating: 5,
    comment: "יעל היא סוכנת נדל\"ן מדהימה. היא עזרה לנו למכור את הדירה במחיר גבוה יותר ממה שציפינו.",
    propertyId: "p8",
    createdAt: "2023-10-20",
  },
  {
    id: "r4",
    agentId: "a2",
    clientName: "רונית שמעוני",
    rating: 4,
    comment: "אלון היה מקצועי מאוד ועזר לנו במציאת הנכס המתאים לנו ביותר.",
    propertyId: "p9",
    createdAt: "2023-08-15",
  },
  {
    id: "r5",
    agentId: "a2",
    clientName: "יוסי מזרחי",
    rating: 5,
    comment: "שירות מעולה! אלון היה קשוב לצרכים שלנו והצליח למצוא לנו דירה מעולה.",
    propertyId: "p10",
    createdAt: "2023-09-10",
  },
  {
    id: "r6",
    agentId: "a1",
    clientName: "שירה ברקוביץ",
    rating: 5,
    comment: "יעל היא אשת מקצוע אמיתית. הבינה בדיוק מה אנחנו מחפשים והצליחה למצוא לנו את הבית החלומות שלנו.",
    propertyId: "p11",
    createdAt: "2023-11-15",
  },
  {
    id: "r7",
    agentId: "a1",
    clientName: "נועם גולדמן",
    rating: 4,
    comment: "יעל תמיד זמינה לשאלות ועזרה בכל שלב בתהליך. מקצועיות ברמה גבוהה.",
    propertyId: "p12",
    createdAt: "2023-12-02",
  },
  {
    id: "r8",
    agentId: "a1",
    clientName: "טל אברהם",
    rating: 5,
    comment: "הליווי של יעל היה מושלם מהרגע הראשון ועד לחתימת החוזה. ממליץ בחום!",
    propertyId: "p13",
    createdAt: "2024-01-20",
  },
];

// Mock Properties
export const properties: Property[] = [
  {
    id: "p1",
    title: "דירת גן מרווחת",
    address: "רחוב אינשטיין 15, רמת אביב",
    neighborhood: "n1",
    price: 4500000,
    size: 120,
    bedrooms: 4,
    bathrooms: 2,
    description:
      "דירת גן מרווחת עם גינה פרטית, מרפסת ומטבח מודרני. הנכס ממוקם בקרבת פארק הירקון, מוסדות חינוך ומרכזי קניות.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    features: ["גינה פרטית", "חניה", "מיזוג אוויר", "מרפסת", "מחסן"],
    coordinates: {
      lat: 32.1135,
      lng: 34.7958,
    },
    agentId: "a1",
    createdAt: "2023-09-15",
    status: "active",
  },
  {
    id: "p11",
    title: "דירת גג מושלמת",
    address: "רחוב אינשטיין 24, רמת אביב",
    neighborhood: "n1",
    price: 7500000,
    soldPrice: 6750000,
    size: 180,
    bedrooms: 5,
    bathrooms: 3,
    description:
      "דירת גן מרווחת עם גינה פרטית, מרפסת ומטבח מודרני. הנכס ממוקם בקרבת פארק הירקון, מוסדות חינוך ומרכזי קניות.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    features: ["גינה פרטית", "חניה", "מיזוג אוויר", "מרפסת", "מחסן"],
    coordinates: {
      lat: 32.1135,
      lng: 34.7958,
    },
    agentId: "a1",
    createdAt: "2022-09-15",
    status: "sold",
  },
  {
    id: "p2",
    title: "פנטהאוז יוקרתי",
    address: "רחוב איינשטיין 40, רמת אביב",
    neighborhood: "n1",
    price: 8500000,
    size: 200,
    bedrooms: 5,
    bathrooms: 3,
    description:
      "פנטהאוז יוקרתי עם נוף מרהיב לים, מרפסת גג ענקית, מטבח מאובזר וחדרים מרווחים. הנכס כולל חניה כפולה ומחסן.",
    images: [
      "https://images.unsplash.com/photo-1628133287836-40bd5453bed1",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    ],
    features: ["נוף לים", "חניה כפולה", "מיזוג אוויר", "מרפסת גג", "מחסן"],
    coordinates: {
      lat: 32.1155,
      lng: 34.7940,
    },
    agentId: "a1",
    createdAt: "2023-10-01",
    status: "active",
  },
  {
    id: "p3",
    title: "דירת בוטיק בנווה צדק",
    address: "רחוב שבזי 22, נווה צדק",
    neighborhood: "n2",
    price: 6200000,
    size: 110,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "דירת בוטיק משוחזרת בבניין לשימור, תקרות גבוהות, רצפת פרקט, מטבח מעוצב ומרפסת שמש. הנכס ממוקם במרחק הליכה למסעדות, גלריות ומרכז סוזן דלל.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    ],
    features: ["בניין לשימור", "תקרות גבוהות", "רצפת פרקט", "מרפסת שמש"],
    coordinates: {
      lat: 32.0638,
      lng: 34.7663,
    },
    agentId: "a1",
    createdAt: "2023-10-10",
    status: "active",
  },
  {
    id: "p4",
    title: "דירה קלאסית ברחביה",
    address: "רחוב אלפסי 15, רחביה",
    neighborhood: "n3",
    price: 5500000,
    size: 130,
    bedrooms: 4,
    bathrooms: 2,
    description:
      "דירה קלאסית בבניין אבן ירושלמי, מרפסת פונה לגינה, סלון מרווח, חדרים גדולים ומטבח משופץ. הנכס קרוב לגן העצמאות, מוסדות חינוך ובתי כנסת.",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600607688969-a48377e0c24b",
    ],
    features: ["בניין אבן", "מרפסת", "סלון מרווח", "מטבח משופץ"],
    coordinates: {
      lat: 31.7722,
      lng: 35.2170,
    },
    agentId: "a2",
    createdAt: "2023-09-20",
    status: "active",
  },
  {
    id: "p5",
    title: "וילה מפוארת בכרמל",
    address: "רחוב הפרחים 8, כרמל",
    neighborhood: "n4",
    price: 9500000,
    size: 320,
    bedrooms: 6,
    bathrooms: 4,
    description:
      "וילה מפוארת עם נוף פנורמי למפרץ חיפה, בריכת שחייה, גינה מטופחת, סלון כפול, מרתף ומרפסות מרווחות. הנכס ממוקם באזור שקט ויוקרתי.",
    images: [
      "https://images.unsplash.com/photo-1600047509782-20d39509f26d",
      "https://images.unsplash.com/photo-1600566753229-a09a8fef0be8",
    ],
    features: [
      "בריכת שחייה",
      "נוף פנורמי",
      "גינה מטופחת",
      "חניה כפולה",
      "מרתף",
    ],
    coordinates: {
      lat: 32.8070,
      lng: 34.9785,
    },
    agentId: "a2",
    createdAt: "2023-10-05",
    status: "active",
  },
  // New active properties
  {
    id: "p11",
    title: "דירת סטודיו בפלורנטין",
    address: "רחוב פלורנטין 45, תל אביב",
    neighborhood: "n5",
    price: 2800000,
    size: 55,
    bedrooms: 1,
    bathrooms: 1,
    description:
      "דירת סטודיו מעוצבת בלב פלורנטין, משופצת ברמה גבוהה עם גלריה, חלונות גדולים ומטבח פתוח. מיקום מצוין קרוב למסעדות, ברים וגלריות.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    ],
    features: ["משופצת", "גלריה", "מטבח פתוח", "מיזוג אוויר", "תקרות גבוהות"],
    coordinates: {
      lat: 32.0580,
      lng: 34.7707,
    },
    agentId: "a1",
    createdAt: "2023-11-10",
    status: "active",
  },
  {
    id: "p12",
    title: "דירת גג בנווה צדק",
    address: "רחוב שבזי 50, נווה צדק",
    neighborhood: "n2",
    price: 7300000,
    size: 150,
    bedrooms: 4,
    bathrooms: 2,
    description:
      "דירת גג מרהיבה עם מרפסת גג פרטית ונוף פנורמי לתל אביב. הדירה משופצת ברמה גבוהה, כוללת מטבח מאובזר, חדר מאסטר גדול עם חדר רחצה צמוד.",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    ],
    features: ["מרפסת גג", "נוף פנורמי", "חניה", "מעלית", "מטבח מאובזר"],
    coordinates: {
      lat: 32.0640,
      lng: 34.7665,
    },
    agentId: "a1",
    createdAt: "2023-11-25",
    status: "active",
  },
  {
    id: "p13",
    title: "דירת לופט ברמת אביב",
    address: "רחוב ברודצקי 25, רמת אביב",
    neighborhood: "n1",
    price: 5200000,
    size: 130,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "דירת לופט בעיצוב מודרני, תקרות גבוהות, חלונות רחבים, מטבח פתוח ואיכותי. קרובה לאוניברסיטת תל אביב ולפארק הירקון.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
    ],
    features: ["עיצוב מודרני", "תקרות גבוהות", "מטבח פתוח", "חניה", "מחסן"],
    coordinates: {
      lat: 32.1140,
      lng: 34.7960,
    },
    agentId: "a1",
    createdAt: "2023-12-05",
    status: "active",
  },
  // Sold properties
  {
    id: "p6",
    title: "דירה משופצת",
    address: "רחוב כצנלסון 42, רמת אביב",
    neighborhood: "n1",
    price: 3800000,
    soldPrice: 3750000,
    size: 95,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "דירה מרווחת ומשופצת בלב גבעתיים, קרובה לפארק גבעתיים ולמרכז המסחרי. הדירה כוללת מטבח חדש, חלונות אלומיניום וסלון מרווח.",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600563438938-a9a27215d8eb",
    ],
    features: ["משופצת", "מעלית", "חניה", "מיזוג אוויר", "סורגים"],
    coordinates: {
      lat: 32.0728,
      lng: 34.8123,
    },
    agentId: "a1",
    createdAt: "2023-05-10",
    status: "sold",
    soldDate: "2023-06-15",
  },
  {
    id: "p7",
    title: "דירת גג בתל אביב",
    address: "רחוב דיזנגוף 210, תל אביב",
    neighborhood: "n2",
    price: 5900000,
    soldPrice: 5850000,
    size: 140,
    bedrooms: 4,
    bathrooms: 2,
    description:
      "דירת גג מקסימה עם נוף לים ולעיר, מרפסת גג גדולה עם פינת ישיבה חיצונית. הדירה כוללת מטבח מאובזר, סלון מרווח וחדרי שינה נוחים.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1628133287836-40bd5453bed1",
    ],
    features: ["מרפסת גג", "נוף לים", "מעלית", "חניה", "מיזוג מרכזי"],
    coordinates: {
      lat: 32.0853,
      lng: 34.7818,
    },
    agentId: "a1",
    createdAt: "2023-04-05",
    status: "sold",
    soldDate: "2023-05-20",
  },
  {
    id: "p8",
    title: "פנטהאוז ענק",
    address: "רחוב המדע 8, רמת אביב",
    neighborhood: "n1",
    price: 11500000,
    soldPrice: 11200000,
    size: 290,
    bedrooms: 5,
    bathrooms: 3,
    description:
      "פנטהאוז יוקרתי בהרצליה פיתוח עם נוף פנורמי לים, מרפסת ענקית, חדר מאסטר עם חדר ארונות וחדר רחצה צמוד. הדירה כוללת מטבח מפואר, סלון כפול וחניה כפולה.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
    ],
    features: ["פנטהאוז", "נוף לים", "מרפסת גג", "חניה כפולה", "מחסן"],
    coordinates: {
      lat: 32.1620,
      lng: 34.8032,
    },
    agentId: "a1",
    createdAt: "2023-02-10",
    status: "sold",
    soldDate: "2023-03-25",
  },
  {
    id: "p9",
    title: "דירת גן נדירה",
    address: "רחוב אחוזה 126, תל אביב",
    neighborhood: "n3",
    price: 4900000,
    soldPrice: 4850000,
    size: 135,
    bedrooms: 4,
    bathrooms: 2,
    description:
      "דירת גן מרווחת עם גינה פרטית, פינת משפחה גדולה וסלון מואר. הדירה כוללת מטבח מאובזר, חדרי שינה גדולים ומחסן צמוד.",
    images: [
      "https://images.unsplash.com/photo-1600566752447-1c2a08ae6dac",
      "https://images.unsplash.com/photo-1600566752734-c1f4d61f9ae7",
    ],
    features: ["גינה פרטית", "פינת משפחה", "מחסן", "חניה", "מיזוג אוויר"],
    coordinates: {
      lat: 32.1836,
      lng: 34.8721,
    },
    agentId: "a2",
    createdAt: "2023-06-01",
    status: "sold",
    soldDate: "2023-07-15",
  },
  {
    id: "p10",
    title: "דירת יוקרה במרינה בהרצליה",
    address: "רחוב הצדף 9, הרצליה",
    neighborhood: "n4",
    price: 7200000,
    soldPrice: 7100000,
    size: 180,
    bedrooms: 4,
    bathrooms: 3,
    description:
      "דירת יוקרה במרינה בהרצליה עם נוף מרהיב לים, מרפסת גדולה הפונה למרינה ולים. הדירה כוללת מטבח יוקרתי, סלון גדול וחדרי שינה מרווחים.",
    images: [
      "https://images.unsplash.com/photo-1600607688939-a48b0a0eeba5",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    features: ["נוף לים", "מרפסת", "חניה כפולה", "מעלית", "בריכה בבניין"],
    coordinates: {
      lat: 32.1640,
      lng: 34.7913,
    },
    agentId: "a2",
    createdAt: "2023-03-10",
    status: "sold",
    soldDate: "2023-04-25",
  },
  // New sold properties
  {
    id: "p14",
    title: "דירת 3 חדרים בפלורנטין",
    address: "רחוב פלורנטין 78, תל אביב",
    neighborhood: "n5",
    price: 3200000,
    soldPrice: 3150000,
    size: 85,
    bedrooms: 3,
    bathrooms: 1,
    description:
      "דירה מקסימה בלב פלורנטין עם אופי ייחודי, מרפסת שמש, מטבח משודרג וסלון מרווח. קרובה למסעדות, בתי קפה ותחבורה ציבורית.",
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1613545325268-9265e1609167",
    ],
    features: ["מרפסת שמש", "אופי ייחודי", "מטבח משודרג", "מיקום מרכזי"],
    coordinates: {
      lat: 32.0582,
      lng: 34.7710,
    },
    agentId: "a1",
    createdAt: "2023-07-15",
    status: "sold",
    soldDate: "2023-08-20",
  },
  {
    id: "p15",
    title: "דופלקס בנווה צדק",
    address: "רחוב אילת 15, נווה צדק",
    neighborhood: "n2",
    price: 7800000,
    soldPrice: 7650000,
    size: 180,
    bedrooms: 4,
    bathrooms: 3,
    description:
      "דופלקס מרהיב בנווה צדק עם אדריכלות ייחודית, שילוב של ישן וחדש, מרפסת גג פרטית וגינה קטנה. בניין משומר עם אופי אותנטי.",
    images: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3",
      "https://images.unsplash.com/photo-1581974206967-93856b25aa13",
    ],
    features: ["דופלקס", "בניין משומר", "מרפסת גג", "גינה", "אדריכלי"],
    coordinates: {
      lat: 32.0635,
      lng: 34.7658,
    },
    agentId: "a1",
    createdAt: "2023-08-10",
    status: "sold",
    soldDate: "2023-09-15",
  },
];

// Format price to Israeli shekel
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date to Hebrew format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Get neighborhood by ID
/* export const getNeighborhoodById = (id: string): Neighborhood | undefined => {
  return neighborhoods.find((n) => n.id === id);
}; */

// Get agent by ID
/* export const getAgentById = (id: string): Agent | undefined => {
  return agents.find((a) => a.id === id);
}; */

// Get properties by neighborhood
export const getPropertiesByNeighborhood = (
  neighborhoodId: string
): Property[] => {
  return properties.filter((p) => p.neighborhood === neighborhoodId);
};

// Get property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return properties.find((p) => p.id === id);
};

// Get sold properties by agent
export const getSoldPropertiesByAgent = (agentId: string): Property[] => {
  return properties.filter(
    (p) => p.agentId === agentId && p.status === "sold"
  );
};

// Get active properties by agent
export const getActivePropertiesByAgent = (agentId: string): Property[] => {
  return properties.filter(
    (p) => p.agentId === agentId && p.status === "active"
  );
};

// Get reviews by agent
export const getReviewsByAgent = (agentId: string): Review[] => {
  return reviews.filter((r) => r.agentId === agentId);
};

// Calculate average rating for an agent
export const calculateAverageRating = (agentId: string): number => {
  const agentReviews = getReviewsByAgent(agentId);
  if (agentReviews.length === 0) return 0;
  
  const totalRating = agentReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / agentReviews.length).toFixed(1));
};
