export interface CatDetails {
  id: number | string;
  name: string;
  breed: string;
  age: number | string;
  image: string;
  personality: string;
  gender: "Male" | "Female";
  isNeutered: boolean;
  isVaccinated: boolean;
  isAdopted: boolean; // 👈 إضافة خاصية التبني (true / false)
  city: string;
  phone: string; // Required property for phone number
}

export const pics: CatDetails[] = [
  {
    id: 1,
    name: "Lucas",
    breed: "Scottish Fold",
    age: 3,
    image: "/images/Cats/pic9.png",
    personality:
      "Lucas is an extremely affectionate, playful, and energetic cat. He loves sitting by the window, chasing laser lights, and cuddling during nap time.",
    gender: "Male",
    isNeutered: true,
    isVaccinated: true,
    isAdopted: true, // 👈 متبنى
    city: "Riyadh",
    phone: "0501234567",
  },
  {
    id: 2,
    name: "Yoshi",
    breed: "Persian",
    age: 5,
    image: "/images/Cats/pic10.png",
    personality:
      "Yoshi is a gentle, docile, and affectionate cat. He enjoys lounging in sunny spots, playing with feather toys, and being brushed regularly.",
    gender: "Male",
    isNeutered: true,
    isVaccinated: false,
    isAdopted: false, // 👈 غير متبنى
    city: "Jeddah",
    phone: "0509876543",
  },
  {
    id: 3,
    name: "Milo",
    breed: "Mixed Breed",
    age: 3,
    image: "/images/Cats/pic11.png",
    personality:
      "Milo is a vocal, social, and intelligent cat. He loves playing with interactive toys, exploring new environments, and receiving attention from his family.",
    gender: "Female",
    isNeutered: false,
    isVaccinated: false,
    isAdopted: false, // 👈 غير متبنى
    city: "Abha",
    phone: "0505555555",
  },
];

// دالة البحث عن القطة باستخدام الـ ID للربط الديناميكي مع صفحة التفاصيل
export function getCatById(id: string | number): CatDetails | undefined {
  return pics.find((cat) => String(cat.id) === String(id));
}