import RegisterForm from '@/features/auth/components/register-form';
import { requireNoAuth } from '@/lib/utils/auth-action';

export default async function RegisterPage() {
  await requireNoAuth();
  return <RegisterForm />;
}
