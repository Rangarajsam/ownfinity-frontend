"use client"
import Image from "next/image";

const ProductImage = ({ imageUrl, imageAlt, width, height }: { imageUrl: string, imageAlt: string, width: number, height: number }) => {
    return (
        <Image
            src={imageUrl || "/no-image.png"}
            alt={imageAlt}
            width={width}
            height={height}
            className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
        />

    );
}

export default ProductImage;