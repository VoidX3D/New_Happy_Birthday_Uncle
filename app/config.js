import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CelebrationGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="luxury-glass border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-100 text-xl font-serif">
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image
            src="/images/placeholders/uncle.png"
            alt="Uncle Rajendra Regmi"
            width={300}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
        </CardContent>
      </Card>

      {/* Celebration Images */}
      {[1, 2, 3, 4].map((num) => (
        <Image
          key={num}
          src={`/images/placeholders/celebration-${num}.png`}
          alt={`Celebration ${num}`}
          width={400}
          height={250}
          className="rounded-xl shadow-lg object-cover"
        />
      ))}
    </div>
  );
}
