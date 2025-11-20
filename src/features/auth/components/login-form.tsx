'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { loginFormSchema, LoginFormData } from '@/features/auth/schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginForm() {
  const t = useTranslations('AuthLayout.Login');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/',
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push('/');
        },
      },
    });
  };

  const signInGithub = async () => {
    await signIn.social(
      {
        provider: 'github',
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          toast.error(
            t('githubError') +
              (error instanceof Error ? error.message : String(error)),
          );
        },
      },
    );
  };

  // use isSubmitting for request-in-flight state, and isValid to enable submit
  const { isValid, isSubmitting } = loginForm.formState;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t('signIn')}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">{t('email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">{t('password')}</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          {t('forgotPassword')}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> {t('login')} </p>
                )}
              </Button>

              <div
                className={cn(
                  'flex w-full items-center gap-2',
                  'flex-col justify-between',
                )}
              >
                <Button
                  type="button"
                  variant="outline"
                  className={cn('w-full gap-2')}
                  disabled={loading}
                  onClick={signInGithub}
                >
                  <Image
                    src="/icons/github.svg"
                    alt="Github Logo"
                    width={16}
                    height={16}
                  />
                  {t('signInGithub')}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col justify-center border-t py-2">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
          <p className="text-center text-xs text-neutral-500">
            {t('noAccount')}{' '}
            <Link href="/register" className="underline hover:text-blue-500">
              {t('signUp')}
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
