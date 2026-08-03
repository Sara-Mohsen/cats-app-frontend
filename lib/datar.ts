// lib/rescueData.ts

export interface RescueDetails {
  formattedId: string;
  id: number | string;
  image: string;
  city: string;
  isInjured: boolean;
  injuryDescription?: string;
  phone: string;
}

export const rescuePics: RescueDetails[] = [
  {
    id: 1,
    image: "/images/Cats/pic4.png",
    city: "Makkah",
    isInjured: true,
    injuryDescription:
      "Lucy has a slight injury on her back leg and needs urgent veterinary care and shelter.",
    phone: "+966 50 123 4567",
    formattedId: "Rescue #01",
  },
  {
    id: 2,
    image: "/images/Cats/pic6.png",
    city: "Riyadh",
    isInjured: false,
    phone: "+966 55 987 6543",
    formattedId: "Rescue #02",
  },
  {
    id: 3,
    image: "/images/Cats/pic7.png",
    city: "Jeddah",
    isInjured: true,
    injuryDescription:
      "Simba is exhausted, suffering from eye inflammation, and requires immediate medical treatment.",
    phone: "+966 54 321 9876",
    formattedId: "Rescue #03",
  },
];

// دالة جلب حالة الانقاذ حسب الـ ID
export function getRescueById(id: string | number): RescueDetails | undefined {
  return rescuePics.find((item) => String(item.id) === String(id));
}
