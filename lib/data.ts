
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
  city: string;
}
 
export const pics: CatDetails[] = [
  {
    id: 1,
    name: "Luna",
    breed: "Orange Tabby",
    age: 2,
    image: "/images/Cats/pic1.png",
    personality:
      "Luna is an extremely affectionate, playful, and energetic cat. She loves sitting by the window, chasing laser lights, and cuddling during nap time.",
    gender: "Female",
    isNeutered: true,
    isVaccinated: true,
    city: "Riyadh",
  },
  {
    id: 2,
    name: "Oliver",
    breed: "Ragdoll",
    age: 2,
    image: "/images/Cats/pic3.png",
    personality:
      "Oliver is a gentle, docile, and affectionate cat. He enjoys lounging in sunny spots, playing with feather toys, and being brushed regularly.",
    gender: "Male",
    isNeutered: true,
    isVaccinated: false,
    city: "Jeddah",
  },
  {
    id: 3,
    name: "Bella",
    breed: "Siamese",
    age: 3,
    image: "/images/Cats/pic8.png",
    personality:
      "Bella is a vocal, social, and intelligent cat. She loves playing with interactive toys, exploring new environments, and receiving attention from her family.",
    gender: "Female",
    isNeutered: false,
    isVaccinated: true,
    city: "Dammam",
  },
  {
    id: 4,
    name: "Charlie",
    breed: "Maine Coon",
    age: 4,
    image: "/images/Cats/pic5.png",
    personality:
      "Charlie is a friendly, gentle, and intelligent cat. He enjoys playing with puzzle toys, cuddling on the couch, and exploring his surroundings.",
    gender: "Male",
    isNeutered: false,
    isVaccinated: false,
    city: "Riyadh",
  },
  {
    id: 5,
    name: "Milo",
    breed: "British",
    age: 5,
    image: "/images/Cats/pic2.png",
    personality:
      "Milo is a calm, sweet, and affectionate cat. He enjoys lounging in sunny spots, playing with gentle toys, and being petted by his family.",
    gender: "Male",
    isNeutered: true,
    isVaccinated: true,
    city: "Makkah",
  },
];

// دالة البحث عن القطة باستخدام الـ ID للربط الديناميكي مع صفحة التفاصيل
export function getCatById(id: string | number): CatDetails | undefined {
  return pics.find((cat) => String(cat.id) === String(id));
}
