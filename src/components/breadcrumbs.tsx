'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/lib/hooks/use-breadcrumbs';
import { SlashIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          let title = decodeURIComponent(item.title);
          title = title.length > 15 ? title.slice(0, 15) + '...' : title;
          return (
            <Fragment key={item.title}>
              {index !== items.length - 1 && (
                <BreadcrumbItem className="hidden md:block">
                  <Link
                    className="hover:text-foreground transition-colors"
                    href={item.link}
                  >
                    {title}
                  </Link>
                </BreadcrumbItem>
              )}
              {index < items.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block">
                  <SlashIcon />
                </BreadcrumbSeparator>
              )}
              {index === items.length - 1 && (
                <BreadcrumbPage>{title}</BreadcrumbPage>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
