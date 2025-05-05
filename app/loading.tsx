import React from 'react';
import Image from 'next/image';
import loaderImg from "@/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      <Image src={loaderImg} height={150} width={150} alt='Loading...' />
    </div>
  );
}

export default LoadingPage;