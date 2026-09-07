import Image from "next/image";

export default function CatCover() {
  return (
    <div className="cat-cover mb-8 grid overflow-hidden rounded-3xl border-2 border-stone-800 bg-[#fff6df] md:grid-cols-2">
      <div className="flex flex-col justify-center p-6 sm:p-9">
        <p className="mb-3 text-xs font-bold tracking-[0.16em] text-orange-800">TWO CATS. ZERO FILTER.</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Big ideas.<br />Tiny troublemakers.</h1>
        <p className="mt-4 max-w-sm text-sm leading-7 text-stone-600">A cozy home for your notes, plans, and questionable genius. Orange and Tabby are judging. Lovingly.</p>
      </div>
      <Image src="/cats/cover.png" alt="A mischievous orange cat and gray tabby lounging beside a notebook" width={1536} height={1024} priority className="h-full w-full object-contain" sizes="(max-width: 768px) 100vw, 600px" />
    </div>
  );
}
