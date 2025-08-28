import { NextResponse } from 'next/server';

const logos = [
  '/placeholders/logos/bandits.png',
  '/placeholders/logos/yeti.png',
  '/placeholders/logos/wizards.png',
  '/placeholders/logos/osos.png',
  '/placeholders/logos/marmots.png',
  '/placeholders/logos/foxes.png',
  '/placeholders/logos/coyotes.png',
  '/placeholders/logos/goats.png',
  '/placeholders/logos/hawks.png',
  '/placeholders/logos/drakes.png',
  '/placeholders/logos/yetis.png',
  '/placeholders/logos/titans.png',
];

export async function POST() {
  const logoUrl = logos[Math.floor(Math.random()*logos.length)];
  return NextResponse.json({ logoUrl });
}
