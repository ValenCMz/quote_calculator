"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import logo from "@/img/logo.png";
import nike from "@/img/nike.jpg";
import gengar from "@/img/gengar.jpg";
import { Instagram } from "lucide-react";

type ImgType = string | StaticImageData;

interface DesignLevel {
  id: string;
  name: string;
  price: number;
  image: ImgType;
}

export default function QuoteCalculator() {
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(90);
  const [selectedLevel, setSelectedLevel] = useState<string>("simple");
  const [designLevels, setDesignLevels] = useState<
    Array<DesignLevel & { image: ImgType }>
  >([
    {
      id: "intermedio",
      name: "Intermedio",
      price: 15,
      image: nike,
    },
    {
      id: "dificil",
      name: "Dificil",
      price: 20,
      image: gengar,
    },
  ]);

  // Load prices from localStorage on mount
  useEffect(() => {
    const savedPrices = localStorage.getItem("carpetPrices");
    if (savedPrices) {
      const prices = JSON.parse(savedPrices);
      setDesignLevels((prev) =>
        prev.map((level) => ({
          ...level,
          price: prices[level.id] || level.price,
        }))
      );
    }
  }, []);

  const dimensionOptions = [60, 70, 80, 90, 100, 120, 150, 180, 200, 250, 300];

  const area = width * height;
  const selectedLevelData = designLevels.find((l) => l.id === selectedLevel);
  const pricePerCm2 = selectedLevelData?.price || 0;
  const totalPrice = area * pricePerCm2;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-AR").format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-accent/30 to-secondary/50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Admin Link */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Calculadora de Alfombras
            </h1>
          </div>
        </div>

        {/* Dimension Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-primary text-sm font-medium mb-2">
              Ancho
            </label>
            <select
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full bg-accent/40 border-2 border-primary rounded-2xl px-4 py-4 text-foreground text-xl font-semibold appearance-none cursor-pointer hover:bg-accent/60 transition-colors"
            >
              {dimensionOptions.map((dim) => (
                <option key={dim} value={dim}>
                  {dim} cm
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-primary text-sm font-medium mb-2">
              Alto
            </label>
            <select
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-accent/40 border-2 border-primary rounded-2xl px-4 py-4 text-foreground text-xl font-semibold appearance-none cursor-pointer hover:bg-accent/60 transition-colors"
            >
              {dimensionOptions.map((dim) => (
                <option key={dim} value={dim}>
                  {dim} cm
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Design Level Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">
            Nivel de Diseño
          </h2>
          <div className="grid grid-cols-2 gap-5 w-full mx-auto justify-center items-center scale-105">
            {designLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`relative rounded-2xl p-6 transition-all flex flex-col items-center ${
                  selectedLevel === level.id
                    ? "bg-accent/60 border-2 border-primary scale-105"
                    : "bg-accent/30 border-2 border-accent hover:bg-accent/40"
                }`}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-background/50 w-[150px] h-[150px] relative">
                  <Image
                    src={level.image}
                    alt={level.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="block text-foreground font-bold text-xl mt-3 text-center">
                  {level.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quote Display */}
        <Card className="bg-primary/20 border-2 border-primary rounded-3xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary text-center mb-4">
            Cotización
          </h2>
          <div className="text-center mb-6">
            <p className="text-5xl md:text-6xl font-bold text-foreground">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-4 border border-primary">
            <h3 className="text-foreground font-semibold text-center mb-3">
              Detalle del cálculo:
            </h3>
            <div className="text-foreground text-sm space-y-1 text-center">
              <p>
                Dimensiones: {width} × {height} cm
              </p>
              <p>Área total: {formatNumber(area)} cm²</p>
              <p>
                Nivel {selectedLevelData?.name}: ${pricePerCm2} ×{" "}
                {formatNumber(area)} cm²
              </p>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="flex flex-col items-center justify-center  ">
          <p className="text-foreground/80 text-sm text-center leading-relaxed">
            El precio calculado es una estimación orientativa. El valor final
            puede variar según el diseño, nivel de detalle y materiales
            seleccionados, para una cotización más precisa enviar un mensaje por
            instagram.
          </p>

          <div className="relative w-64 h-64 overflow-hidden text-center">
            <Link
              href="https://www.instagram.com/homespun.rugs/"
              target="_blank"
            >
              <Image src={logo} alt="Logo" fill className="object-cover" />
            </Link>
          </div>
          <Link
            href="https://www.instagram.com/homespun.rugs/"
            target="_blank"
            className="inline-flex items-center gap-1 hover:text-primary/80 transition-colors "
          >
            <Instagram className="h-6 w-6 text-primary" />
            <span className="font-semibold">@homespun.rugs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
