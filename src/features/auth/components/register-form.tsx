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
import { RegisterFormData, registerFormSchema } from '@/features/auth/schema';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('AuthLayout.Register');

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: '',
    },
  });

  const imagePreview = useWatch({
    control: registerForm.control,
    name: 'image',
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fieldChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Submitting form with data:', data);
    await signUp.email({
      email: data.email,
      password: data.password,
      name: data.username,
      image: data.image,
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

  return (
    <Card className="z-50 max-w-md rounded-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t('signUp')}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">{t('username')}</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        autoComplete="username"
                        placeholder="Bao"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">{t('password')}</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      {t('confirmPassword')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-2">
                <FormLabel htmlFor="image">{t('profileImage')}</FormLabel>
                <div className="flex items-end gap-4">
                  {imagePreview && (
                    <div className="relative h-16 w-24 overflow-hidden rounded-sm">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="flex w-full items-center">
                    <FormField
                      name="image"
                      control={registerForm.control}
                      render={({
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              {...fieldProps}
                              id="image"
                              type="file"
                              accept="image/*"
                              className="w-full"
                              onChange={(event) => {
                                handleImageChange(event, onChange);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {imagePreview && (
                      <X
                        className={cn('cursor-pointer')}
                        onClick={() => {
                          registerForm.setValue('image', '');
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  t('createAccount')
                )}
              </Button>
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
            {t('haveAccount')}{' '}
            <Link href="/login" className="underline hover:text-blue-500">
              {t('signIn')}
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
