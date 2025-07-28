import { loader } from 'fumadocs-core/source';
import { docs } from "@/.source";
import Image from 'next/image';
import { createElement } from 'react';

export const source = loader({
  baseUrl: "/learn",
  source: docs.toFumadocsSource(),
  icon(iconName) {
    if (!iconName) return;

    // You can add conditional logic here
    switch(iconName) {
      case 'Solana':
        return createElement(Image, {
          src: '/solanaLogo.png',
          alt: 'Solana',
          width: 48,
          height: 48
        });
        case 'Rust':
        return createElement(Image, {
          src: '/rust-2.png',
          alt: 'Rust',
          width: 48,
          height: 48
        });
        case 'Anchor':
        return createElement(Image, {
          src: '/anchor.png',
          alt: 'Anchor',
          width: 48,
          height: 48
        });
        case 'NextJS':
        return createElement(Image, {
          src: '/nextjs.png',
          alt: 'Next.js',
          width: 48,
          height: 48
        });
      // Add more cases as needed
      
    }
  }
});
