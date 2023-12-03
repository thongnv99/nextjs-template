'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const Home = () => {
  const { data } = useSession();
  return (
    <div>
      {JSON.stringify(data)}

      <button className="btn" type="button" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
};

export default Home;
