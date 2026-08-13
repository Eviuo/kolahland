import { CapIcon, BucketIcon, BeanieIcon } from "@/components/icons/hat-icons";

export function BrandStory() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper" aria-labelledby="story-heading">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-light">داستان کلاه‌لند</p>
          <h2 id="story-heading" className="mt-3 text-display-2 font-extrabold text-balance">
            سنت را با ترند ترکیب می‌کنیم
          </h2>
          <p className="mt-6 max-w-lg leading-8 text-paper/65">
            کلاه‌لند از یک ایده ساده شروع شد: کلاهی که هم راحت باشد، هم اصل، هم قیمتی منصفانه داشته باشد. هر مدل پیش از
            عرضه توسط تیم طراحی ما از نظر جنس پارچه، دوخت و تناسب اندازه بررسی می‌شود تا مطمئن شویم چیزی که می‌فرستیم
            دقیقاً همانی‌ست که در عکس می‌بینید.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex aspect-[4/5] items-center justify-center rounded-2xl border border-paper/10 bg-paper/[0.04] p-8">
            <CapIcon className="h-full w-full text-paper/80" aria-hidden />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
              <BucketIcon className="h-full w-full text-paper/80" aria-hidden />
            </div>
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
              <BeanieIcon className="h-full w-full text-paper/80" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
