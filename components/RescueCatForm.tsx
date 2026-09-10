"use client";

import React from "react";
import { Check, X, Phone } from "lucide-react";

export type CityOption = { id: number; name: string };

export type RescueData = {
  rescueId?: string; 
  hasInjury: boolean;
  injuryDescription: string;
  city: string;
  phoneNumber: string;
};

type RescueCatFormProps = {
  data: RescueData;
  onChange: (data: RescueData) => void;
  cities: CityOption[];
  loading?: boolean;
};

const SAUDI_PHONE_REGEX = /^05\d{8}$/;

export function isValidSaudiPhone(phone: string): boolean {
  return SAUDI_PHONE_REGEX.test(phone.trim());
}

export default function RescueCatForm({
  data,
  onChange,
  cities,
  loading = false,
}: RescueCatFormProps) {
  const phoneTouched = data.phoneNumber.length > 0;
  const phoneValid = isValidSaudiPhone(data.phoneNumber);

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    onChange({ ...data, phoneNumber: digitsOnly });
  };

  return (
    <div className="space-y-4">
      {data.rescueId && (
        <div className="flex items-center justify-between bg-purple-50 p-3 rounded-2xl border border-purple-100">
          <span className="text-xs font-bold text-purple-900 uppercase">
            Rescue Case ID:
          </span>
          <span className="text-xs font-extrabold text-purple-700 bg-white px-3 py-1 rounded-xl border border-purple-200">
            {data.rescueId}
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
          City *
        </label>
        <select
          value={data.city}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white/80 border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          disabled={loading}
          required
        >
          <option value="" disabled hidden>
            {loading ? "Loading cities..." : "Choose City"}
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-pink-900 uppercase">
            Is Injured?:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...data, hasInjury: true })}
              className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ${
                data.hasInjury
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              <Check size={14} /> Yes
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, hasInjury: false })}
              className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ${
                !data.hasInjury
                  ? "bg-gray-400 text-white"
                  : "bg-white text-gray-500 border border-pink-200"
              }`}
            >
              <X size={14} /> No
            </button>
          </div>
        </div>

        {data.hasInjury && (
          <div className="pt-2 border-t border-pink-100">
            <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
              Injury Description *
            </label>
            <textarea
              rows={2}
              value={data.injuryDescription}
              onChange={(e) =>
                onChange({ ...data, injuryDescription: e.target.value })
              }
              placeholder="Describe the injury..."
              className="w-full p-3 bg-white border border-pink-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              required
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-pink-900 uppercase mb-1.5">
          User Phone Number *
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-3.5 top-3 text-pink-400" />
          <input
            type="tel"
            inputMode="numeric"
            value={data.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="05XXXXXXXX"
            maxLength={10}
            className={`w-full pl-10 pr-4 py-2.5 bg-white/80 border rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 ${
              phoneTouched && !phoneValid
                ? "border-red-300 focus:ring-red-400"
                : "border-pink-200 focus:ring-pink-400"
            }`}
            required
          />
        </div>
        {phoneTouched && !phoneValid && (
          <p className="text-xs text-red-500 mt-1 px-1">
            Please enter a valid Saudi phone number (e.g., 05XXXXXXXX).
          </p>
        )}
      </div>
    </div>
  );
}
