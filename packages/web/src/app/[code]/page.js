import { redirect, notFound } from 'next/navigation';

async function getRedirectUrl(code) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}/tools/s/${code}`, {
      method: 'GET',
      redirect: 'manual',
    });

    if (response.status === 302) {
      const redirectUrl = response.headers.get('location');
      return redirectUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching redirect URL:', error);
    return null;
  }
}

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  if (!code || !/^[a-zA-Z0-9\-_]{1,20}$/.test(code)) {
    notFound();
  }
  
  const redirectUrl = await getRedirectUrl(code);
  
  if (redirectUrl) {
    redirect(redirectUrl);
  } else {
    notFound();
  }
}
