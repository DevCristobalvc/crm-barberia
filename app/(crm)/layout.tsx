import { MainLayout } from "@/app/layout-main";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
