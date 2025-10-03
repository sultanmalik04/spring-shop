import Link from 'next/link';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].downloadUrl}`}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
