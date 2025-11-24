import LoginForm from '@/features/auth/components/login-form';
import { requireNoAuth } from '@/lib/utils/auth-action';

export default async function LoginPage() {
  // await requireNoAuth();
  return <LoginForm />;
}
