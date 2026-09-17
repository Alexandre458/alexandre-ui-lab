"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, Expand } from "lucide-react";

type Device = "desktop" | "tablet" | "mobile";
const devices = [{ id: "desktop", label: "Desktop", Icon: Monitor }, { id: "tablet", label: "Tablet", Icon: Tablet }, { id: "mobile", label: "Mobile", Icon: Smartphone }] as const;

export function DevicePreview({ src, title }: { src: string; title: string }) {
  const [device, setDevice] = useState<Device>("desktop");
  return <div>
    <div className="preview-toolbar">
      <div className="device-controls" role="group" aria-label="Tamanho do preview">
        {devices.map(({ id, label, Icon }) => <button type="button" key={id} className={device === id ? "active" : ""} onClick={() => setDevice(id)} aria-pressed={device === id}><Icon size={16} aria-hidden="true" />{label}</button>)}
      </div>
      <a className="button-secondary" href={src} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${title} em tela cheia`}><Expand size={16} aria-hidden="true" />Tela cheia</a>
    </div>
    <div className="frame-wrap">
      <iframe
        className={`preview-frame ${device}`}
        title={`Preview interativo de ${title}`}
        src={src}
        loading="eager"
        sandbox={process.env.NODE_ENV === "production" ? "allow-scripts" : "allow-scripts allow-same-origin"}
      />
    </div>
  </div>;
}
