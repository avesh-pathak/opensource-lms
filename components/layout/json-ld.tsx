export default function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://aveshpathaklms.vercel.app',
  logo: 'https://aveshpathaklms.vercel.app/icon.svg',
  name: 'Babua DSA',
  description: 'The Elite Registry for Engineering Mastery',
  founder: {
    '@type': 'Person',
    name: 'Avesh Pathak',
    url: 'https://twitter.com/aveshpathak',
  },
  sameAs: [
    'https://twitter.com/aveshpathak',
    'https://github.com/avesh-pathak',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'iamaveshpathak@gmail.com',
  },
}
