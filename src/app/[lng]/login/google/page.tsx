'use client';
import Preload from 'components/Preload';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const GoogleLoginPage = () => {
  const query = useSearchParams();

  useEffect(() => {
    const accessToken = query.get('accessToken');
    if (accessToken) {
      handleLoginToken(accessToken);
    }
  }, []);

  const handleLoginToken = async (accessToken: string) => {
    try {
      const res = await signIn('token', {
        accessToken,
      });
      if (res?.ok) {
        window.location.reload();
      } else {
        //redirect to login page
      }
    } catch (error) {
      console.log(error);
    }
  };
  return <Preload />;
};

export default GoogleLoginPage;
