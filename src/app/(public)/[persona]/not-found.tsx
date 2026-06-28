import Link from "next/link";

export default function PersonaNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="relative">
          <span className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-neutral-100 dark:text-neutral-900 select-none">
            404
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug">这个画面还没拍出来</h3>
          <p className="text-base leading-relaxed text-neutral-500 max-w-sm mx-auto">
            你要找的页面不在这个卷轴里。
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link href="/" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 px-5 py-2.5 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
            回到首页
          </Link>
          <Link href="/default/works" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 px-5 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            浏览作品
          </Link>
        </div>
      </div>
    </div>
  );
}
