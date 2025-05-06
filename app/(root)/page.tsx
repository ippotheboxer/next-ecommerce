import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import React from 'react';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <div>
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </div>
  );
}

export default HomePage;