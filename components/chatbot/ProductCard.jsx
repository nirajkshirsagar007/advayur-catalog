import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-2 w-64 max-w-[80vw]">
      {product.image && (
        <div className="h-32 w-full relative bg-gray-50">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
        {product.price && (
          <p className="font-semibold text-green-600 text-sm mt-1">₹{product.price}</p>
        )}
        {product.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}
        
        <div className="mt-3">
          <Link 
            href={product.slug ? `/product/${product.slug}` : `/product/${product._id}`}
            className="block w-full text-center bg-black text-white text-xs py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
