import { redirect, notFound } from 'next/navigation';

interface PageProps {
  params: {
    code: string;
  };
}

async function getRedirectUrl(code: string): Promise<string | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}/tools/s/${code}`, {
      method: 'GET',
      redirect: 'manual', // Important: prevent automatic redirects
    });

    if (response.status === 302) {
      // API returned a redirect, get the location header
      const redirectUrl = response.headers.get('location');
      return redirectUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching redirect URL:', error);
    return null;
  }
}

export default async function RedirectPage({ params }: PageProps) {
  const { code } = params;
  
  // Validate code format
  if (!code || !/^[a-zA-Z0-9\-_]{1,20}$/.test(code)) {
    notFound();
  }
  
  // Fetch the original URL from API
  const redirectUrl = await getRedirectUrl(code);
  
  if (redirectUrl) {
    // Redirect to the original URL
    redirect(redirectUrl);
  } else {
    // Short code not found
    notFound();
  }
}
