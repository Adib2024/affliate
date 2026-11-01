// Utiliti UI kecil: simpanan, toast, copy, chip, share.

export const $ = (sel, root = document) => root.querySelector(sel);

export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(`rp.${key}`);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`rp.${key}`, JSON.stringify(value));
    } catch { /* storage penuh / disekat — abaikan */ }
  },
};

let toastTimer;
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

export async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  if (btn) {
    const old = btn.innerHTML;
    btn.classList.add('done');
    btn.textContent = '✓ Dah copy';
    setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = old; }, 1400);
  } else {
    toast('✓ Dah copy');
  }
}

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

/**
 * Lukis kumpulan chip.
 * options: [{value, label}] ; selected: value | value[] (multi)
 */
export function chips(container, options, selected, { multi = false, onChange } = {}) {
  let current = multi ? [...(selected || [])] : selected;
  const render = () => {
    container.replaceChildren(...options.map((o) => {
      const on = multi ? current.includes(o.value) : current === o.value;
      return el('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(on),
        onClick: () => {
          if (multi) {
            current = on ? current.filter((v) => v !== o.value) : [...current, o.value];
          } else {
            current = o.value;
          }
          render();
          onChange?.(multi ? [...current] : current);
        },
      }, o.label);
    }));
  };
  render();
  return {
    set(v) { current = multi ? [...v] : v; render(); },
    get: () => current,
  };
}

// ---------- Share ----------
export function shareTo(target, text, link) {
  const enc = encodeURIComponent;
  const open = (url) => window.open(url, '_blank', 'noopener');
  switch (target) {
    case 'whatsapp': return open(`https://wa.me/?text=${enc(text)}`);
    case 'telegram': return open(`https://t.me/share/url?url=${enc(link || ' ')}&text=${enc(text)}`);
    case 'threads': return open(`https://www.threads.net/intent/post?text=${enc(text)}`);
    case 'x': return open(`https://x.com/intent/post?text=${enc(text)}`);
    case 'facebook':
      copyText(text);
      toast('✓ Caption dah copy — paste dalam post Facebook');
      return open(link ? `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}` : 'https://www.facebook.com/');
    case 'native':
      if (navigator.share) return navigator.share({ text }).catch(() => {});
      copyText(text);
      return toast('Share tak disokong — caption dah dicopy');
    default:
      return null;
  }
}

export function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = el('a', { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
