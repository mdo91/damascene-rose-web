export const siteConfig = {
  name: 'Damas Technologies',
  contactEmail: 'hi@damastechnologies.com',
  websiteUrl: 'https://www.damascenerose.com',
  websiteDomain: 'damascenerose.com',
  privacyPolicyUrl: 'https://www.damascenerose.com/privacy-policy.html',
  termsOfUseUrl: 'https://www.damascenerose.com/terms-of-use.html',
} as const;

export const legalPages = [
  { href: '/terms-of-use.html', label: 'Terms of Use' },
  { href: '/privacy-policy.html', label: 'Privacy Policy' },
  { href: '/support.html', label: 'Support' },
] as const;
