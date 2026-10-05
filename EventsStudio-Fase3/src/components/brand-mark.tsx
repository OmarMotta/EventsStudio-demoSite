import { brand } from "@/lib/site";

export function BrandMark() {
  return (
    <a href="/" aria-label="Events Studio — homepage" className="inline-flex min-h-14 w-32 items-center justify-center md:w-36">
        {/* Display window removes only transparent padding; original pixels remain untouched. */}
        <span className="relative block aspect-[349/168] w-full overflow-hidden">
          <img src={`${brand.logo}?v=transparent`} alt="Events Studio" width={472} height={423} fetchPriority="high" className="absolute left-[-18.3381%] top-[-64.2857%] h-auto w-[135.2436%] max-w-none" />
        </span>
    </a>
  );
}
