import type {Project} from '../data/projects';
import type {Product} from '../data/products';
import {buildReferences} from '../data/build-references';

const origin = 'https://makhex.com';
export const absoluteSiteUrl = (path: string) => new URL(path, origin).href;

const projectSearchCopy: Record<string, {title: string; description: string}> = {
  'touch-weather-station': {
    title: 'ESP32 Touch Weather Station: Parts & Build Plan | MAKHEX',
    description: 'Plan an ESP32-S3 touch weather station with a BME280 sensor and LVGL. Review the component BOM, firmware steps and compatibility checks on MAKHEX.'
  },
  'voice-command-node': {
    title: 'ESP32 Offline Voice Command Project & BOM | MAKHEX',
    description: 'Explore an ESP32-S3 offline voice command prototype with an I2S microphone and speaker. See the proposed build steps, parts and audio limitations.'
  },
  'tiny-ble-presence': {
    title: 'ESP32-C3 BLE Beacon Beginner Project | MAKHEX',
    description: 'Build-plan a tiny ESP32-C3 Bluetooth LE beacon. Learn advertising basics, privacy considerations, power measurements and the required parts.'
  },
  'plant-health-monitor': {
    title: 'ESP32 Plant Monitor with BME280: Project BOM | MAKHEX',
    description: 'Explore an ESP32-C3 plant environment monitor using a BME280. Follow the proposed sensor dashboard steps and review the parts on MAKHEX.'
  },
  'camera-event-trigger': {
    title: 'ESP32-S3 Camera Event Detection Project | MAKHEX',
    description: 'Plan a local ESP32-S3 camera event trigger using image-change detection, memory checks and privacy safeguards. See the electronics parts list.'
  },
  'epaper-desk-calendar': {
    title: 'ESP32 E-Paper Desk Calendar: Build Plan | MAKHEX',
    description: 'Explore an ESP32-C3 e-paper calendar build with time sync, SPI display setup and low-power testing. Review the parts list and engineering notes.'
  },
  'indoor-voc-explorer': {
    title: 'ESP32 Air Quality VOC Sensor Project | MAKHEX',
    description: 'Plan an ESP32-S3 indoor VOC trend dashboard with SGP40 and BME280 sensors. See the I2C parts list, compensation steps and safety caveats.'
  },
  'rgb-matrix-clock': {
    title: 'ESP32 Addressable RGB LED Clock Project | MAKHEX',
    description: 'Explore an ESP32-C3 RGB LED clock with WS2812 pixels. Review the planned BOM, 5 V supply sizing and firmware development steps.'
  },
  'espnow-remote': {
    title: 'ESP-NOW Remote Control with ESP32-C3 | MAKHEX',
    description: 'Plan a two-board ESP32-C3 ESP-NOW wireless remote. Review pairing, packet testing, reliability, electrical considerations and the project BOM.'
  },
  'smart-desk-button': {
    title: 'ESP32 Smart Button: Simple Wi-Fi Project | MAKHEX',
    description: 'Create a plan for an ESP32-C3 Wi-Fi smart button with physical feedback and a status LED. Browse parts, firmware tasks and safety notes.'
  },
  'mosaico-learning-assistant': {
    title: 'ESP-Mosaico AI Photo & Voice Learning Assistant | MAKHEX',
    description: 'Explore the ESP-Mosaico photo and voice learning assistant, matching hardware, camera and firmware limitations, demo media and parts on MAKHEX.'
  },
  'microduck-robot': {
    title: 'Microduck Walking Robot: BOM, Servos & CAD | MAKHEX',
    description: 'Explore the Microduck 15-servo walking robot by kissqy. Review original demo media, Radxa and STM32 hardware, the project BOM and gated CAD files.'
  }
};

export function projectSeo(project: Project) {
  const copy = projectSearchCopy[project.slug] ?? {
    title: project.title + ' Project & Parts List | MAKHEX',
    description: project.summary
  };
  const image = buildReferences[project.slug]?.image ??
    (project.slug === 'microduck-robot' ? '/demo/microduck/microduck-hero.jpg' :
    project.slug === 'mosaico-learning-assistant' ? '/demo/build11-english-lifestyle-wide.jpg' : '/og.png');
  return {...copy, image};
}

export function componentSeo(product: Product, usedBy: Project[]) {
  const title = product.title + ' | MAKHEX Parts & Specs';
  const related = usedBy.length ? ' Used in ' + usedBy[0].title + '.' : '';
  const full = product.title + ': ' + product.descriptor + '.' + related +
    ' Review specs and add parts to your MAKHEX cart; supplier qualification pending.';
  const description = full.length <= 160 ? full : full.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return {title, description, image: '/product-media/' + product.slug + '.jpg'};
}

export function breadcrumbs(items: {name: string; path: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteSiteUrl(item.path)
    }))
  };
}

const makhexAuthor = {'@type': 'Organization', name: 'MAKHEX', url: origin + '/'};

export function projectStructuredData(project: Project, heroImage: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.summary,
    url: absoluteSiteUrl('/projects/' + project.slug + '/'),
    image: absoluteSiteUrl(heroImage),
    author: makhexAuthor,
    publisher: makhexAuthor,
    inLanguage: 'en-US',
    genre: 'Proposed electronics and robotics build guide',
    about: project.tech.map(name => ({'@type': 'Thing', name})),
    educationalLevel: project.level,
    isAccessibleForFree: true
  };
}

export function componentStructuredData(product: Product, image: string) {
  // Research-stage components are NOT eligible verified merchant offers.
  // Do not emit Product/Offer price or availability until exact SKU checkout is certified.
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: product.title + ' — specifications and build applications',
    description: product.description,
    url: absoluteSiteUrl('/shop/' + product.slug + '/'),
    image: absoluteSiteUrl(image),
    author: makhexAuthor,
    publisher: makhexAuthor,
    inLanguage: 'en-US',
    about: {'@type': 'Thing', name: product.title},
    genre: 'Maker component technical reference'
  };
}
