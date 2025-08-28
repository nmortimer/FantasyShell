'use client';
import { useEffect } from 'react';
export default function Confetti() {
  useEffect(()=>{
    const emojis = ['✨','💥','🎉','⭐','🌟'];
    const els: HTMLElement[] = [];
    for (let i=0;i<40;i++){
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.position='fixed';
      el.style.left = Math.random()*100+'vw';
      el.style.top = '-10px';
      el.style.fontSize = (16 + Math.random()*20)+'px';
      el.style.zIndex = '9999';
      el.style.transition = 'transform 3s ease, opacity 3s ease';
      document.body.appendChild(el);
      els.push(el);
      setTimeout(()=>{
        el.style.transform = `translateY(${100+Math.random()*100}vh) rotate(${Math.random()*360}deg)`;
        el.style.opacity = '0';
      }, 20);
    }
    const tm = setTimeout(()=>els.forEach(e=>e.remove()), 4000);
    return ()=>{ clearTimeout(tm); els.forEach(e=>e.remove()); };
  }, []);
  return null;
}
