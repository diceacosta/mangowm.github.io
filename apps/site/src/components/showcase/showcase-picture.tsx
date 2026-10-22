import type { ComponentProps } from "react";
import { imageSrc, imageSrcSet, type ShowcaseImage } from "@/lib/showcase-data";

type Props = Omit<
  ComponentProps<"img">,
  "src" | "srcSet" | "sizes" | "width" | "height" | "alt"
> & {
  image: ShowcaseImage;
  alt: string;
  sizes: string;
};

export function ShowcasePicture({ image, alt, sizes, ...props }: Props) {
  return (
    <img
      {...props}
      src={imageSrc(image)}
      srcSet={imageSrcSet(image)}
      sizes={sizes}
      alt={alt}
      width={image.width}
      height={image.height}
    />
  );
}
