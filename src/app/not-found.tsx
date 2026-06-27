import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

/**
 * Cinematic 404 page.
 *
 * Not a standard error page.
 * A quiet moment — like a fade to black in a film.
 * The viewer is gently guided back, not scolded.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <Container size="narrow">
        <div className="text-center space-y-8">
          {/* Subtle visual: just a number */}
          <div className="relative">
            <span className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-neutral-100 dark:text-neutral-900 select-none">
              404
            </span>
            {/* Accent line crossing the number */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-neutral-300 dark:bg-neutral-700"
            />
          </div>

          <div className="space-y-3">
            <Typography variant="h3">
              这个画面还没拍出来
            </Typography>
            <Typography variant="body" className="text-neutral-500 max-w-sm mx-auto">
              你要找的页面不在这个卷轴里。也许它还没有被创作，也许它去了另一个剪辑线。
            </Typography>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button href="/" variant="primary">
              回到首页
            </Button>
            <Button href="/default/works" variant="secondary">
              浏览作品
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
