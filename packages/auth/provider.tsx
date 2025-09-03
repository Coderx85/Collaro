'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Theme } from '@clerk/types';
import { useTheme } from 'next-themes';
import type { ComponentProps } from 'react';
import { env } from 'env';

type AuthProviderProperties = ComponentProps<typeof ClerkProvider>;

export const AuthProvider: React.FC<AuthProviderProperties> = ({
  ...properties
}: AuthProviderProperties) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const baseTheme = isDark ? dark : undefined;

  const variables: Theme['variables'] = {
    fontFamily: 'var(--font-sans)',
    fontFamilyButtons: 'var(--font-sans)',
    fontWeight: {
      bold: 'var(--font-weight-bold)',
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
    },
  };

  const elements: Theme['elements'] = {
    dividerLine: 'bg-border',
    socialButtonsIconButton: 'bg-card',
    navbarButton: 'text-foreground',
    organizationSwitcherTrigger__open: 'bg-background',
    organizationPreviewMainIdentifier: 'text-foreground',
    organizationSwitcherTriggerIcon: 'text-muted-foreground',
    organizationPreview__organizationSwitcherTrigger: 'gap-2',
    organizationPreviewAvatarContainer: 'shrink-0',
  };

  return (
    <ClerkProvider
      {...properties}
      signInFallbackRedirectUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      signInUrl={env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      appearance={{
        layout: {
          animations: true,
          logoPlacement: "inside",
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/icons/logo.png",
        },
        baseTheme,
        elements,
        variables
      }}
    />
  );
};