import React, { useRef } from 'react';
import { 
  X, Download, Printer, ShieldCheck, QrCode, Building, 
  MapPin, User, FileText, CheckCircle2, Award, Sparkles
} from 'lucide-react';

interface CertificateModalProps {
  ulpin: string;
  buildingName?: string;
  floorNumber?: number;
  unitNumber?: string;
  ownerName?: string;
  areaSqm?: number | string;
  propertyType?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({
  ulpin,
  buildingName = 'Jaydev Tower (Building B03)',
  floorNumber = 4,
  unitNumber = '402',
  ownerName = 'Rajesh Kumar Patel',
  areaSqm = 125.0,
  propertyType = 'Residential Apartment (Freehold)',
  isOpen,
  onClose
}: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Top Actions Bar */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Government of Odisha • Revenue & Disaster Management Department
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-950 flex justify-center">
          <div 
            ref={printRef}
            className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 border-2 border-amber-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative space-y-6 text-slate-100"
          >
            {/* Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Award className="w-96 h-96 text-amber-400" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-amber-500/30 pb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" /> National Spatial Data Infrastructure (NSDI)
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Official 3D Cadastral Title Certificate
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Issued under the Vertical Property Mapping & Spatial Registration Act, 2026. Certified Volumetric Space Identifier.
              </p>
            </div>

            {/* 3D ULPIN Hero Box */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-blue-500/40 text-center space-y-2 relative z-10 shadow-inner">
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Unique 3D Property Identifier (3D ULPIN)</div>
              <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider select-all break-all bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                {ulpin}
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                <span>State: OD</span> • <span>City: BBSR</span> • <span>Ward: W12</span> • <span>Parcel: P002</span> • <span>Bldg: B03</span> • <span>Floor: F04</span> • <span>Unit: U02</span>
              </div>
            </div>

            {/* Split Grid: Details + QR Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 text-xs">
              <div className="sm:col-span-2 space-y-3">
                <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Primary Titleholder:</span>
                    <span className="font-bold text-white">{ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Property Class:</span>
                    <span className="font-semibold text-slate-200">{propertyType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Building Complex:</span>
                    <span className="font-semibold text-white">{buildingName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Floor Level & Unit:</span>
                    <span className="font-semibold text-blue-400">Floor {floorNumber} • Unit {unitNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Carpet Area:</span>
                    <span className="font-mono font-bold text-emerald-400">{areaSqm} m² ({Math.round(parseFloat(String(areaSqm)) * 10.764)} sq.ft)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Volumetric Bounding Coordinates:</div>
                  <div className="text-slate-300">Centroid: 20.2961° N, 85.8245° E • Alt: 24.0m</div>
                  <div className="text-emerald-400 text-[10px]">LiDAR Spatial Tolerance: ± 15mm RTK</div>
                </div>
              </div>

              {/* QR Code Column */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-center space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Scan to Verify 3D Model</div>
                  <div className="text-[9px] font-mono text-slate-500">SHA-256 Ledger Hash Verified</div>
                </div>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-[11px]">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-slate-400">Issuing Authority:</div>
                <div className="font-bold text-white">Directorate of Land Records & Surveys, Odisha</div>
                <div className="text-[10px] font-mono text-slate-500">Date of Sanction: 2026-02-28 12:00:00 IST</div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-mono text-emerald-400 font-bold flex items-center justify-center sm:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed (Sub-Registrar)
                </div>
                <div className="text-[10px] font-mono text-slate-500">Certificate ID: CERT-3DULPIN-BBSR-2026-0491</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

