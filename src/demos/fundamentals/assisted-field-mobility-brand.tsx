"use client";

import { useState } from "react";
import { Bike, Bus, Car } from "lucide-react";
import { normalizePlace, parseDecimal } from "./local-values";
const vehicles = [{ id: "bike", name: "Bike Vita", speed: 15, Icon: Bike }, { id: "car", name: "EcoCar 1.0", speed: 60, Icon: Car }, { id: "bus", name: "MetroBus L3", speed: 40, Icon: Bus }];

export default function AssistedFieldMobilityBrand() {
  const [origin, setOrigin] = useState(""); const [destination, setDestination] = useState(""); const [distance, setDistance] = useState("");
  const [vehicle, setVehicle] = useState("bike"); const [confirmed, setConfirmed] = useState(false);
  const km = parseDecimal(distance); const validDistance = km !== null && km > 0 && km <= 200;
  const same = origin.trim() !== "" && normalizePlace(origin) === normalizePlace(destination);
  const ready = origin.trim().length >= 4 && destination.trim().length >= 4 && validDistance && !same;
  const selected = vehicles.find(item => item.id === vehicle)!;
  return <section className="revision-demo route-demo" aria-label="Comparador de trajetos"><div className="route-map">
    <header><span className="demo-kicker">VELO / 015 · ROTAS CONCEITUAIS</span><h1>O mesmo caminho.<br /><em>Três ritmos.</em></h1><p>Compare duração estimada pela distância e pela velocidade fixa.</p></header>
    <div className="route-terminals"><label>Origem<input value={origin} maxLength={80} onChange={event => { setOrigin(event.target.value); setConfirmed(false); }} /></label><span aria-hidden="true">↓</span><label>Destino<input value={destination} maxLength={80} onChange={event => { setDestination(event.target.value); setConfirmed(false); }} /></label><label>Distância da rota (km)<input value={distance} inputMode="decimal" aria-describedby="route-help" aria-invalid={distance !== "" && !validDistance} onChange={event => { setDistance(event.target.value); setConfirmed(false); }} /></label></div>
    <p id="route-help">Maior que 0 e até 200 km. Minutos = distância ÷ velocidade × 60, arredondados para cima.</p><fieldset className="route-options"><legend>Compare os veículos</legend>{vehicles.map(({ id, name, speed, Icon }) => <label key={id} className={vehicle === id ? "selected" : ""}><input type="radio" name="route-vehicle" checked={vehicle === id} onChange={() => { setVehicle(id); setConfirmed(false); }} /><Icon size={30} aria-hidden="true" /><strong>{name}</strong><span>{speed} km/h</span><b>{validDistance ? `${Math.ceil(km! / speed * 60)} min` : "— min"}</b></label>)}</fieldset>
    <div className="route-result" role="status">{same ? "Origem e destino precisam ser diferentes." : confirmed ? `Plano local: ${origin.trim()} → ${destination.trim()} · ${selected.name} · ${Math.ceil(km! / selected.speed * 60)} min` : "Preencha os terminais e compare uma distância válida."}</div><div className="revision-actions"><button type="button" disabled={!ready || confirmed} onClick={() => { if (ready) setConfirmed(true); }}>Planejar rota</button><button type="button" onClick={() => { setOrigin(""); setDestination(""); setDistance(""); setVehicle("bike"); setConfirmed(false); }}>Reiniciar rota</button></div><p className="revision-note">Sem GPS ou trânsito em tempo real. Veículos e percurso são fictícios.</p>
  </div></section>;
}
