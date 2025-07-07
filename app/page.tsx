import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome! Please log in to get started</h1>
      <Image
        src="/thumbs-up-icon.jpg"
        alt="Logo"
        width={300}
        height={300}

      />
      <a href="/auth/login">
        <Button className="bg-blue-500 text-white px-4 py-2 rounded">Login</Button>
      </a>
    </div>
  );
}
