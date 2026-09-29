"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { useSound } from "@/components/game/useSound";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface PersonalPicsCarouselProps {
  images: { src: string; alt: string }[];
}

export default function PersonalPicsCarousel({
  images,
}: PersonalPicsCarouselProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Slides whose full image has been requested. Only the current slide and
  // its neighbours load, so the gallery no longer pulls all 16 photos
  // (embla's off-screen slides defeat native lazy-loading).
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const play = useSound();

  const onThumbClick = useCallback(
    (index: number) => {
      play("click");
      mainApi?.scrollTo(index);
    },
    [mainApi, play],
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    setLoaded((prev) => {
      if (prev.has(index - 1) && prev.has(index) && prev.has(index + 1)) {
        return prev;
      }
      return new Set([...prev, index - 1, index, index + 1]);
    });
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  if (images.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading">
      {/* Header */}
      <h2 id="gallery-heading" className="font-pixel text-[10px] text-accent">
        ◆ GALLERY
      </h2>

      {/* Main carousel */}
      <div className="mt-4">
        <Carousel
          setApi={setMainApi}
          className="w-full"
          aria-label="Photo gallery"
        >
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem
                key={img.src}
                aria-label={`${index + 1} of ${images.length}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden pixel-border bg-surface sm:aspect-[16/9]">
                  {loaded.has(index) && (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 992px"
                      className="object-cover pixelated"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Pixel-art nav controls */}
        <div className="mt-3 flex items-center justify-between">
          <PixelNavButton
            direction="prev"
            disabled={selectedIndex === 0}
            onClick={() => {
              play("click");
              mainApi?.scrollPrev();
            }}
          />
          <span className="font-pixel text-[10px] text-muted">
            {String(selectedIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          <PixelNavButton
            direction="next"
            disabled={selectedIndex === images.length - 1}
            onClick={() => {
              play("click");
              mainApi?.scrollNext();
            }}
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      <Carousel
        setApi={setThumbApi}
        opts={{
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="mt-3 w-full"
        aria-label="Gallery thumbnails"
      >
        <CarouselContent className="-ml-2">
          {images.map((img, index) => (
            <CarouselItem
              key={img.src}
              className="basis-1/5 pl-2 sm:basis-1/6 lg:basis-1/8"
            >
              <button
                type="button"
                aria-label={`Show photo ${index + 1}: ${img.alt}`}
                aria-current={index === selectedIndex ? "true" : undefined}
                onClick={() => onThumbClick(index)}
                className={cn(
                  "pixel-border relative block aspect-square w-full cursor-pointer overflow-hidden transition-all duration-200",
                  index === selectedIndex
                    ? "opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-background"
                    : "opacity-40 hover:opacity-70 focus-visible:opacity-100",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 20vw, 128px"
                  className="object-cover pixelated"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function PixelNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center pixel-border bg-surface font-pixel text-xs transition-colors",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer text-foreground hover:border-accent hover:text-accent hover:shadow-pixel-accent active:translate-x-px active:translate-y-px active:shadow-none",
      )}
    >
      {direction === "prev" ? "◄" : "►"}
    </button>
  );
}
