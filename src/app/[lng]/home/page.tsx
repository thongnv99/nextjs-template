'use client';
import Header from 'components/Header';
import React from 'react';

const Home = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div className="flex-1 w-full p-8">
        <div className="w-full h-full flex items-center justify-center m-auto max-w-screen-lg rounded-lg border border-dashed border-primary-500">
          Main Content
        </div>
      </div>
    </div>
  );
};

export default Home;
