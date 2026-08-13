# کلاه‌لند (Kolahland.ir)

فروشگاه آنلاین کلاه — مینیمال، پرمیوم، ساخته‌شده برای بازار ایران (فارسی/RTL، تومان).

## وضعیت این تحویل (مهم بخوانید)

این پروژه یک **فونداسیون واقعی و قابل‌اجرا** است، نه یک دمو. کد داخل `src/` واقعاً کار می‌کند و با
`next build` واقعی تست شده (۲۳ صفحه، شامل ۷ دسته‌بندی و ۸ محصول، بدون خطای TypeScript کامپایل شدند).
اما یک فروشگاه کامل با پنل ادمین، بلاگ، پرداخت، احراز هویت و ده‌ها صفحه، یک پروژه چند هفته‌ای مهندسی
است. آنچه تا این مرحله ساخته شده: **صفحه اصلی + فروشگاه + دسته‌بندی + جزئیات محصول**، همگی کامل. مراحل
بعدی در پایین این فایل مشخص شده‌اند.

### فاز ۲ — فروشگاه و صفحه محصول (تکمیل‌شده)

- `/shop` — فیلتر قیمت، مرتب‌سازی (پیشنهادی/جدیدترین/ارزان‌ترین/گران‌ترین/امتیاز)، صفحه‌بندی با
  `rel=prev/next`
- `/category/[slug]` — ۷ دسته با `generateStaticParams`، توضیحات و متادیتای منحصربه‌فرد برای هرکدام
  (بدون محتوای تکراری)
- `/product/[slug]` — انتخاب رنگ/سایز/تعداد (تعاملی)، Product Schema کامل با قیمت و وضعیت موجودی،
  FAQ Schema، بخش نظرات با میانگین امتیاز، محصولات مرتبط
- کامپوننت‌های جدید: `Breadcrumbs` (با BreadcrumbList JSON-LD)، `StarRating`، `FilterSidebar`،
  `SortSelect`، `Pagination`، `ProductPurchasePanel`، `ReviewsSection`، `RelatedProducts`
- دکمه «افزودن به سبد خرید» از نظر UI/state کاملاً کار می‌کند؛ اتصال به سبد خرید ماندگار (Prisma
  Cart/CartItem) در فاز بعد انجام می‌شود — این در کد با کامنت مشخص شده است.
- ثبت نظر محصول به ورود کاربر نیاز دارد (لینک به `/login`) چون فاز احراز هویت هنوز ساخته نشده.


## پشته فنی (Tech Stack)

- **Next.js 14 (App Router)** + TypeScript
- **Tailwind CSS** + سیستم توکن طراحی سفارشی (`tailwind.config.ts`)
- **Prisma ORM 7** + PostgreSQL, driver-adapter based (`@prisma/adapter-pg`) — شمای کامل در `prisma/schema.prisma`،
  تنظیمات CLI در `prisma.config.ts` (Prisma 7 دیگر connection URL را از schema.prisma نمی‌خواند)
- **NextAuth** — آماده اتصال (schema دارد، pages باقی مانده)
- **معماری پرداخت ماژولار** — `src/lib/payments/` — سوییچ بین Stripe و زرین‌پال با یک متغیر محیطی
- **Framer Motion، React Hook Form، Zod** — در dependencies آماده استفاده هستند

## ساختار پروژه — هر فایل کجاست

```
kolahland/
├── prisma.config.ts             # تنظیمات CLI پریزما (Prisma 7): مسیر schema، migrations، اتصال دیتابیس برای CLI
├── prisma/
│   ├── schema.prisma          # مدل کامل داده: کاربر، محصول، سفارش، بلاگ، کوپن...
│   └── seed.ts                 # بارگذاری محصولات واقعی در دیتابیس
│
├── src/
│   ├── app/                    # مسیرهای Next.js (App Router)
│   │   ├── layout.tsx           # لایوت اصلی: فونت وزیرمتن، RTL، JSON-LD سازمانی
│   │   ├── page.tsx              # صفحه اصلی ✅ کامل
│   │   ├── globals.css           # توکن‌های رنگ/تایپوگرافی، حالت تاریک
│   │   ├── sitemap.ts             # sitemap.xml پویا ✅
│   │   ├── robots.ts              # robots.txt ✅
│   │   ├── manifest.ts            # PWA manifest ✅
│   │   ├── shop/page.tsx           # فروشگاه: فیلتر، مرتب‌سازی، صفحه‌بندی ✅
│   │   ├── category/[slug]/page.tsx # صفحه هر دسته‌بندی (۷ مسیر استاتیک) ✅
│   │   └── product/[slug]/page.tsx   # جزئیات محصول + Product/FAQ Schema ✅
│   │
│   ├── components/
│   │   ├── layout/               # Header (ناوبری + سبد خرید)، Footer
│   │   ├── home/                  # Hero، ValueProps، CategoryGrid، FeaturedCollection، BrandStory
│   │   ├── shop/                   # ProductCard، Breadcrumbs، StarRating، FilterSidebar،
│   │   │                            # SortSelect، Pagination، ProductPurchasePanel،
│   │   │                            # ReviewsSection، RelatedProducts
│   │   ├── icons/                   # سیستم آیکون خطی کلاه‌ها (جایگزین عکاسی — به README پایین مراجعه کنید)
│   │   ├── ui/                       # Button، Badge (سبک shadcn)
│   │   └── providers.tsx              # ThemeProvider (حالت تاریک) + Toaster
│   │
│   └── lib/
│       ├── seo.ts                # buildMetadata + همه JSON-LD (Organization, Product, FAQ, Breadcrumb...)
│       ├── utils.ts               # cn()، formatToman()، toPersianDigits()
│       ├── shop-query.ts           # فیلتر/مرتب‌سازی/صفحه‌بندی کاتالوگ از روی searchParams
│       ├── data/products.ts        # کاتالوگ نمونه با محتوای فارسی واقعی (جایگزین می‌شود با Prisma queries)
│       ├── data/reviews.ts          # نظرات نمونه مشتریان
│       └── payments/                # معماری پرداخت ماژولار
│           ├── types.ts              # قرارداد PaymentGateway
│           ├── stripe.ts              # پیاده‌سازی Stripe
│           ├── zarinpal.ts             # پیاده‌سازی زرین‌پال (پیش‌فرض تولید)
│           └── index.ts                 # getPaymentGateway() — نقطه سوییچ
│
├── tailwind.config.ts          # سیستم توکن: ink/paper/charcoal/stone/brass
├── next.config.mjs              # بهینه‌سازی تصویر، هدرهای امنیتی، ریدایرکت‌ها
└── .env.example                  # همه متغیرهای محیطی لازم
```

## سیستم طراحی

به‌جای عکاسی محصول (که بدون عکس واقعی، جعلی/placeholder می‌شد)، یک **سیستم آیکون خطی امضادار** طراحی شده
(`src/components/icons/hat-icons.tsx`): هر دسته کلاه یک illustration تک‌خط مینیمال دارد که در هیرو، کارت محصول و
ناوبری دسته‌ها به‌طور یکپارچه تکرار می‌شود. این یک انتخاب طراحی عمدی است، نه راه‌حل موقت.

پالت رنگ طبق بریف (مشکی/سفید/خاکستری تیره) + یک لهجه برنز محدود (`brass`) فقط برای جزئیات لوکس (امتیاز، آندرلاین
امضا، نشان). تایپوگرافی: فونت وزیرمتن (Vazirmatn) در همه وزن‌ها — یک خانواده فونت هماهنگ برای RTL.

## راه‌اندازی محلی

```bash
npm install
cp .env.example .env        # مقادیر DATABASE_URL و غیره را پر کنید
npm run db:push              # ساخت جداول در PostgreSQL
npm run db:seed               # بارگذاری محصولات نمونه
npm run dev
```

## نقشه راه — پیشرفت

✅ **فروشگاه و صفحه محصول** — `/shop`، `/category/[slug]`، `/product/[slug]`

✅ **پنل ادمین** — `/admin` کامل با محافظت واقعی نشست کاربر (نه فقط کامنت — پایین را ببینید)

✅ **احراز هویت** — Auth.js v5 (`src/auth.ts`) با Credentials provider (bcrypt + Prisma)، `/login`، `/register`،
`/forgot-password`، `/reset-password`. ثبت‌نام و بازیابی رمز عبور Server Action با نوشتن واقعی در دیتابیس هستند
(نه استاب) — این‌ها اولین mutationهای پروژه‌اند که مستقیم به Prisma وصل‌اند، چون بدون نشست کاربر خطری ندارند.
منوی حساب کاربری در هدر (`account-menu.tsx`) به نشست واقعی وصل است: قبل از ورود آیکون ورود، بعد از ورود آواتار
و امکان خروج. مسیر `/admin` اکنون واقعاً بررسی می‌کند نشست موجود و نقش ADMIN باشد، وگرنه ریدایرکت می‌کند.
اجرای `npm install` اکنون به‌طور خودکار `prisma generate` را هم اجرا می‌کند (اسکریپت `postinstall`).
حساب ادمین از `.env` شما ساخته می‌شود، نه از کد: در `.env` مقادیر `SEED_ADMIN_EMAIL` و `SEED_ADMIN_PASSWORD` را با
ایمیل و رمز عبور واقعی خودتان پر کنید و بعد `npm run db:seed` را اجرا کنید. اگر این دو مقدار خالی باشند، seed کردن
حساب ادمین به‌طور خودکار رد می‌شود (بدون خطا) — این‌طوری هیچ رمز عبوری در کد یا چت رد و بدل نمی‌شود.

✅ **حساب کاربری** — `/account` (نمای کلی)، `/account/profile` (ویرایش پروفایل + تغییر رمز عبور)،
`/account/orders` و `/account/orders/[id]` (فاکتور قابل چاپ)، `/account/addresses` (افزودن/ویرایش/حذف/تنظیم
پیش‌فرض). همه با کوئری و mutation واقعی Prisma، محافظت‌شده با نشست کاربر، و با بررسی مالکیت (یک کاربر نمی‌تواند
سفارش یا آدرس کاربر دیگری را ببیند).

✅ **صفحات ثابت و حقوقی** — `/about`، `/contact` (فرم تماس واقعی)، `/faq` (آکاردئون + FAQ Schema)، `/terms`،
`/privacy-policy`، `/shipping-policy`، `/return-policy`، `/not-found` (۴۰۴ برندشده با پیشنهاد محصول)، و
`error.tsx` + `global-error.tsx` (۵۰۰). ⚠️ متن صفحات حقوقی (قوانین، حریم خصوصی) محتوای واقعی و کامل است اما پیش
از انتشار رسمی توصیه می‌شود توسط یک وکیل بازبینی شود — من وکیل نیستم و این صفحات جایگزین مشاوره حقوقی نیستند.

✅ **سبد خرید و پرداخت** — `/cart` (Zustand + localStorage، کار می‌کند برای مهمان و کاربر لاگین‌شده)، `/checkout`
(نیازمند ورود؛ انتخاب/افزودن آدرس، اعمال کد تخفیف با پیش‌نمایش زنده، پرداخت در محل یا آنلاین). قیمت، موجودی و
اعتبار کد تخفیف در `src/lib/actions/checkout.ts` **دوباره از Prisma خوانده و اعتبارسنجی می‌شوند** — چیزی که از
مرورگر می‌آید هیچ‌وقت مستقیم به فاکتور تبدیل نمی‌شود. سفارش با کاهش موجودی واریانت در یک تراکنش ثبت می‌شود.
پرداخت آنلاین به `getPaymentGateway()` وصل است و callback آن در `src/app/api/payments/callback/route.ts`
پیاده‌سازی شده؛ تا وقتی merchant ID واقعی زرین‌پال تنظیم نشود «پرداخت در محل» گزینه‌ای‌ست که همین الان کار می‌کند.

✅ **علاقه‌مندی‌ها و مقایسه** — `/wishlist` (نیازمند ورود، Prisma واقعی، هارت روی کارت محصول و صفحه محصول) و
`/compare` (تا ۴ محصول، سمت کاربر با Zustand، بدون نیاز به ورود).

✅ **جستجو و دسته‌بندی‌ها** — `/search` (جستجو در نام/توضیح/دسته، noindex چون نتایج per-query است) و
`/categories` (فهرست کامل دسته‌ها، جدا از فیلتر فروشگاه).

✅ **حالت تاریک** — دکمه واقعی در هدر (`theme-toggle.tsx`) — قبلاً فقط زیرساختش بود، حالا کاربر می‌تواند فعالش کند.

⚠️ نکته معماری مهم: کاتالوگ نمایشی (`lib/data/products.ts`) و Prisma دو لایه جدا هستند. سبد خرید بر اساس
`slug/رنگ/سایز` کار می‌کند (نه id دیتابیس) دقیقاً برای اینکه این دو لایه هماهنگ بمانند؛ در لحظه ثبت سفارش، سرور
دوباره محصول را با slug در Prisma پیدا می‌کند. علاقه‌مندی‌ها به `product.id` وابسته است، برای همین seed اکنون همان
id کاتالوگ نمونه را روی رکورد Prisma هم می‌گذارد — با اضافه‌شدن محصولات واقعی این هماهنگی خودکار حفظ می‌شود.

باقی‌مانده (به همین کیفیت قابل ساخت است):

1. **اتصال کامل پنل ادمین به Prisma** — mutationهای استاب‌شده در `src/lib/actions/admin.ts` را می‌توان به کوئری‌های واقعی وصل کرد
2. **بلاگ عمومی** — `/blog`، `/blog/[slug]` با Article Schema (داده نمونه‌اش در `lib/data/admin.ts` آماده است)
3. **Flash Sale** — مدل Prisma آماده است، UI ندارد
4. **Recently Viewed** — ساخته نشده
5. **پیشنهاد شخصی‌سازی‌شده هوشمندتر** — فعلاً فقط «محصولات مرتبط» ساده
6. **پیگیری سفارش مهمان (بدون ورود)** — فعلاً فقط برای کاربر لاگین‌شده

بگویید کدام بخش اولویت دارد.
