import { redirect, notFound } from 'next/navigation';

async function getRedirectUrl(code) {
  try {
    const response = await fetch(`/api/tools/s/${code}`, {
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
