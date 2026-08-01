import Image from "next/image";
import {
 PawPrint,
 Cake
} from "lucide-react";

type CardProps = {
  image: string;
  name: string;
  breed: string;
  age: number;
};

export default function Cards({ image, name, breed, age }: CardProps) {
  return (
    <div
      className="
      group
      overflow-hidden
      rounded-3xl
      bg-white/90
      backdrop-blur-xl
      shadow-lg
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      border
      border-white/60"
    >
      <Image
        src={image}
        alt={name}
        width={600}
        height={288}
        className="w-full
        h-72
        object-cover
        transition-transform
        duration-500
        group-hover:scale-105"
      />

      <div className="p-5 space-y-2">
        <h3
        className="
        text-xl
        text-gray-700 font-extrabold
        transition-all
        duration-300
        group-hover:text-pink-400"
        >
        {name}
        </h3>
        
        <div className="flex items-center gap-5 mt-2 text-sm text-gray-500">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <PawPrint className="w-4 h-4" />
            {breed}
          </p>

        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Cake className="w-4 h-4" />
          {age} Years
        </p>
      </div>

      </div>
    </div>
  );
}
