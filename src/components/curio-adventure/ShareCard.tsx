import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Link2, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  emoji: string;
  title: string;
  question: string;
  wowFact: string;
  childName: string;
  sparks: number;
  accuracy: number;
  heroUrl?: string;
}

const W = 1080;
const H = 1350;

const wrap = (ctx: CanvasRenderingContext2D, text: string, max: number): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/**
 * The shareable "Wonder Card" — the viral artifact of a finished Curio.
 * Rendered client-side to a PNG so it can be shared, saved or printed.
 */
const ShareCard: React.FC<Props> = ({
  emoji, title, question, wowFact, childName, sparks, accuracy, heroUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(question)}`;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f1030';
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * 0.5, 260, 40, W * 0.5, 260, 760);
    glow.addColorStop(0, 'rgba(124,92,255,0.55)');
    glow.addColorStop(1, 'rgba(15,16,48,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 900);

    // dotted grid — "field notes" texture
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let x = 60; x < W; x += 40) {
      for (let y = 60; y < H; y += 40) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // hero image band
    if (heroUrl) {
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const i = new Image();
          i.crossOrigin = 'anonymous';
          i.onload = () => resolve(i);
          i.onerror = reject;
          i.src = heroUrl;
        });
        ctx.save();
        roundRect(ctx, 72, 300, W - 144, 420, 40);
        ctx.clip();
        const scale = Math.max((W - 144) / img.width, 420 / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, 72 + ((W - 144) - dw) / 2, 300 + (420 - dh) / 2, dw, dh);
        ctx.restore();
      } catch {
        /* image is optional */
      }
    }

    ctx.textAlign = 'left';

    // eyebrow
    ctx.fillStyle = '#7bf1c6';
    ctx.font = '700 30px "DM Sans", system-ui, sans-serif';
    ctx.fillText('I JUST FIGURED OUT', 72, 130);

    // emoji + title
    ctx.font = '800 74px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    const titleLines = wrap(ctx, `${emoji} ${title}`, W - 144).slice(0, 2);
    titleLines.forEach((l, i) => ctx.fillText(l, 72, 216 + i * 82));

    // wow fact card
    const factTop = heroUrl ? 770 : 420;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    roundRect(ctx, 72, factTop, W - 144, 330, 40);
    ctx.fill();
    ctx.strokeStyle = 'rgba(123,241,198,0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = '700 26px "DM Sans", system-ui, sans-serif';
    ctx.fillText('🤯 WOW FACT', 116, factTop + 66);

    ctx.fillStyle = '#f2f2ff';
    ctx.font = '500 38px "DM Sans", system-ui, sans-serif';
    wrap(ctx, wowFact, W - 232).slice(0, 5).forEach((l, i) => {
      ctx.fillText(l, 116, factTop + 128 + i * 50);
    });

    // stats strip
    const statTop = factTop + 380;
    const stats: [string, string][] = [
      ['⚡ SPARKS', String(sparks)],
      ['🎯 ACCURACY', `${accuracy}%`],
      ['🧠 EXPLORER', childName],
    ];
    stats.forEach(([label, value], i) => {
      const x = 72 + i * ((W - 144) / 3);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '700 24px "DM Sans", system-ui, sans-serif';
      ctx.fillText(label, x, statTop);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 48px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(value, x, statTop + 58);
    });

    // footer
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 28px "DM Sans", system-ui, sans-serif';
    ctx.fillText('wonderwhiz — ask anything, learn everything', 72, H - 72);

    setUrl(canvas.toDataURL('image/png'));
  }, [emoji, title, wowFact, childName, sparks, accuracy, heroUrl]);

  useEffect(() => { void draw(); }, [draw]);

  const download = () => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `wonderwhiz-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    a.click();
    toast.success('Wonder Card saved 📸');
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    const file = blob ? new File([blob], 'wonder-card.png', { type: 'image/png' }) : null;
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (file && nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `I learned: ${title}`,
          text: `${wowFact}\n\nCan you beat my score?`,
          url: shareLink,
        });
      } catch { /* user dismissed */ }
      return;
    }
    download();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`${wowFact}\n\nTry this question: ${shareLink}`);
    setCopied(true);
    toast.success('Challenge link copied — dare a friend!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fun-card p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary">📸 Your Wonder Card</p>
      <p className="mt-1 text-sm text-text-secondary">Share the fact. Dare a friend to answer the same question.</p>

      <canvas ref={canvasRef} width={W} height={H} className="hidden" aria-hidden />
      {url && (
        <img
          src={url}
          alt={`Wonder Card about ${title}`}
          className="mt-4 w-full rounded-3xl border-2 border-border"
        />
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={share} className="fun-chip justify-center">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button onClick={download} className="fun-chip justify-center">
          <Download className="h-3.5 w-3.5" /> Save
        </button>
        <button onClick={copy} className="fun-chip justify-center">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />} Dare
        </button>
      </div>
    </div>
  );
};

export default React.memo(ShareCard);
