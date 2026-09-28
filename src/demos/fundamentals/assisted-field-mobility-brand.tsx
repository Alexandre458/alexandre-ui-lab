"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Navigation, Bike, Car, Bus } from "lucide-react";

type FieldState = "idle" | "focused" | "valid" | "error";

const VEHICLES = [
  { id: "bike", label: "Bike Vita", icon: Bike, speed: "15 km/h" },
  { id: "car", label: "EcoCar 1.0", icon: Car, speed: "60 km/h" },
  { id: "bus", label: "MetroBus L3", icon: Bus, speed: "40 km/h" },
];

export default function AssistedFieldMobilityBrand() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [distance, setDistance] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [fieldStates, setFieldStates] = useState<{ [key: string]: FieldState }>({
    origin: "idle",
    destination: "idle",
    distance: "idle",
  });

  const validatePlace = (value: string): FieldState => {
    if (!value) return "idle";
    if (value.trim().length < 4) return "error";
    return "valid";
  };

  const validateDistance = (value: string): FieldState => {
    if (!value) return "idle";
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num) || num <= 0) return "error";
    if (num > 200) return "error";
    return "valid";
  };

  const estimateTime = (): string => {
    const num = parseFloat(distance.replace(",", "."));
    if (isNaN(num) || num <= 0 || !vehicle) return "";
    const speeds: Record<string, number> = { bike: 15, car: 60, bus: 40 };
    const minutes = Math.round((num / (speeds[vehicle] ?? 60)) * 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours} h ${minutes % 60} min`;
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    setFieldStates((prev) => ({ ...prev, origin: validatePlace(value) }));
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    setFieldStates((prev) => ({ ...prev, destination: validatePlace(value) }));
  };

  const handleDistanceChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, "");
    setDistance(cleaned);
    setFieldStates((prev) => ({ ...prev, distance: validateDistance(cleaned) }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getHelpText = (field: string, state: FieldState) => {
    if (state === "idle") {
      if (field === "origin") return "Ponto de partida do deslocamento";
      if (field === "destination") return "Para onde você vai?";
      return "Distância da rota em quilômetros (até 200 km)";
    }
    if (state === "error") {
      if (field === "origin") return "Informe pelo menos 4 caracteres";
      if (field === "destination") return "Informe pelo menos 4 caracteres";
      return "Distância deve ser entre 0 e 200 km";
    }
    if (state === "valid") {
      if (field === "origin") return "Origem definida";
      if (field === "destination") return "Destino definido";
      return "Distância válida";
    }
    return "";
  };

  const getStateClasses = (state: FieldState) => {
    if (state === "valid") return "route-input is-valid";
    if (state === "error") return "route-input is-error";
    return "";
  };

  const allComplete =
    fieldStates.origin === "valid" &&
    fieldStates.destination === "valid" &&
    fieldStates.distance === "valid" &&
    vehicle !== "";

  const samePlace =
    origin.trim().toLocaleLowerCase("pt-BR") === destination.trim().toLocaleLowerCase("pt-BR") &&
    fieldStates.destination === "valid";

  return (
    <section className="demo-mobility" aria-label="Campo assistido — Marca de Mobilidade">
      <div className="mobility-container">
        <div className="mobility-header">
          <span className="demo-kicker">FUNDAMENTOS / 015</span>
          <div className="mobility-badge-row">
            <Navigation size={14} aria-hidden="true" />
            <span>Velo Mobilidade — Planeje seu deslocamento</span>
          </div>
        </div>

        <div className="mobility-hero">
          <div className="mobility-hero-content">
            <Navigation size={26} aria-hidden="true" className="mobility-hero-icon" />
            <h1>
              Saia do ponto A. <em>Chegue</em> ao ponto B.
            </h1>
            <p>
              Planeje rotas com veículos fictícios da frota Velo. Campos validados em tempo real para um deslocamento sem surpresas.
            </p>
          </div>
        </div>

        <form className="mobility-card" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="mobility-route" aria-label="Rota do deslocamento">
            <legend className="mobility-legend">Rota</legend>
            <div className="mobility-route-line">
              <div className="mobility-node mobility-node-start" aria-hidden="true" />
              <div className="mobility-connector" aria-hidden="true" />
              <div className="mobility-node mobility-node-end" aria-hidden="true" />
            </div>
            <div className="mobility-route-fields">
              <div className="mobility-field">
                <label htmlFor="mob-origin" className="mobility-label">
                  <MapPin size={15} aria-hidden="true" />
                  Origem
                </label>
                <div className={`mobility-input ${getStateClasses(fieldStates.origin)}`}>
                  <input
                    id="mob-origin"
                    type="text"
                    placeholder="Ex: Praça Central"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onBlur={() => handleBlur("origin")}
                    aria-invalid={fieldStates.origin === "error"}
                    aria-describedby="mob-origin-help"
                    autoComplete="off"
                  />
                </div>
                <p
                  id="mob-origin-help"
                  className={`mobility-help ${fieldStates.origin === "error" && touched.origin ? "is-error" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {getHelpText("origin", fieldStates.origin)}
                </p>
              </div>

              <div className="mobility-field">
                <label htmlFor="mob-destination" className="mobility-label">
                  <Navigation size={15} aria-hidden="true" />
                  Destino
                </label>
                <div className={`mobility-input ${getStateClasses(fieldStates.destination)}`}>
                  <input
                    id="mob-destination"
                    type="text"
                    placeholder="Ex: Parque das Fontes"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    onBlur={() => handleBlur("destination")}
                    aria-invalid={fieldStates.destination === "error" || samePlace}
                    aria-describedby="mob-destination-help"
                    autoComplete="off"
                  />
                </div>
                <p
                  id="mob-destination-help"
                  className={`mobility-help ${samePlace ? "is-error" : fieldStates.destination === "error" && touched.destination ? "is-error" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {samePlace ? "Destino não pode ser igual à origem" : getHelpText("destination", fieldStates.destination)}
                </p>
              </div>
            </div>
          </fieldset>

          <div className="mobility-field">
            <label htmlFor="mob-distance" className="mobility-label">
              Distância da rota (km)
            </label>
            <div className={`mobility-input ${getStateClasses(fieldStates.distance)}`}>
              <input
                id="mob-distance"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 4,5"
                value={distance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                onBlur={() => handleBlur("distance")}
                aria-invalid={fieldStates.distance === "error"}
                aria-describedby="mob-distance-help"
              />
              {fieldStates.distance === "valid" && <CheckCircle2 size={18} aria-hidden="true" className="mobility-check" />}
            </div>
            <p
              id="mob-distance-help"
              className={`mobility-help ${fieldStates.distance === "error" && touched.distance ? "is-error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {getHelpText("distance", fieldStates.distance)}
            </p>
          </div>

          <div className="mobility-field">
            <span className="mobility-label" id="mob-vehicle-label">
              Veículo da frota
            </span>
            <div className="mobility-vehicles" role="radiogroup" aria-labelledby="mob-vehicle-label">
              {VEHICLES.map(({ id, label, icon: VehicleIcon, speed }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setVehicle(id)}
                  className={`mobility-vehicle ${vehicle === id ? "is-selected" : ""}`}
                  role="radio"
                  aria-checked={vehicle === id}
                >
                  <VehicleIcon size={20} aria-hidden="true" />
                  <strong>{label}</strong>
                  <small>{speed}</small>
                </button>
              ))}
            </div>
            {vehicle && fieldStates.distance === "valid" && (
              <p className="mobility-estimate" role="status" aria-live="polite">
                <Navigation size={14} aria-hidden="true" />
                Tempo estimado: <strong>{estimateTime()}</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!allComplete || samePlace}
            className="mobility-submit"
            aria-label="Planejar rota"
          >
            {allComplete && !samePlace ? (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                Rota pronta — Planejar
              </>
            ) : (
              <>
                <Navigation size={18} aria-hidden="true" />
                Planejar Rota
              </>
            )}
          </button>

          <p className="mobility-footer">
            Demonstração interativa. Frota e rotas são fictícias. Nenhum dado é enviado.
          </p>
        </form>
      </div>
    </section>
  );
}
