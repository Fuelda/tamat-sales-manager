import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div>
            <Button asChild variant="ghost">
              <Link href="/dashboard">ダッシュボード</Link>
            </Button>
          </div>
          <div>
            <Button asChild>
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>
      </nav>
      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <h1 className="text-4xl font-bold mb-4">会社管理システム</h1>
          <p>ログインしてダッシュボードにアクセスしてください。</p>
        </div>
      </div>
    </div>
  );
}
