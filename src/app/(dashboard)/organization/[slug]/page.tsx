import { requireAuth } from '@/lib/utils/auth-action';

// interface SubdomainPageProps {
//   params: Promise<{ slug: string }>;
// }

export default async function SlugPage() {
  await requireAuth();
  return <div>123</div>;
}
