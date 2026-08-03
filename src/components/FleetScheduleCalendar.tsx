import React, { useState } from 'react';
import { Calendar, Car, Clock, ShieldAlert, CheckCircle2, Wrench, UserCheck, Plus, AlertCircle } from 'lucide-react';

interface VehicleAssignment {
  carId: number;
  carName: string;
  plateNumber: string;
  category: string;
  status: 'Available' | 'Assigned' | 'Maintenance';
  schedule: Record<string, { bookingRef: string; customer: string; status: 'Confirmed' | 'Pending' | 'Maintenance' }>;
}

const INITIAL_FLEET: VehicleAssignment[] = [
  {
    carId: 1,
    carName: 'Mercedes Benz S-Class AMG',
    plateNumber: 'WP CAD-8899',
    category: 'Luxury Sedan',
    status: 'Assigned',
    schedule: {
      '2026-07-30': { bookingRef: 'CAR-8921A', customer: 'David Wright', status: 'Confirmed' },
      '2026-07-31': { bookingRef: 'CAR-8921A', customer: 'David Wright', status: 'Confirmed' },
      '2026-08-01': { bookingRef: 'CAR-9014B', customer: 'Sarah Jenkins', status: 'Confirmed' }
    }
  },
  {
    carId: 2,
    carName: 'BMW 7 Series i7 Luxury',
    plateNumber: 'WP CAD-4412',
    category: 'EV Super Luxury',
    status: 'Available',
    schedule: {
      '2026-08-02': { bookingRef: 'CAR-9102C', customer: 'Michael Chang', status: 'Confirmed' }
    }
  },
  {
    carId: 3,
    carName: 'Toyota Land Cruiser V8 VIP',
    plateNumber: 'WP CBB-5521',
    category: 'Luxury SUV',
    status: 'Maintenance',
    schedule: {
      '2026-07-30': { bookingRef: 'MAINT-001', customer: '50,000km Service', status: 'Maintenance' },
      '2026-07-31': { bookingRef: 'MAINT-001', customer: 'Tire Replacement', status: 'Maintenance' }
    }
  }
];

export default function FleetScheduleCalendar() {
  const [fleet, setFleet] = useState<VehicleAssignment[]>(INITIAL_FLEET);
  const [selectedDate, setSelectedDate] = useState('2026-07-30');

  const DAYS = ['2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04'];

  const handleToggleMaintenance = (carId: number) => {
    setFleet(fleet.map(v => {
      if (v.carId === carId) {
        const nextStatus = v.status === 'Maintenance' ? 'Available' : 'Maintenance';
        return { ...v, status: nextStatus };
      }
      return v;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-[#0091EA]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Fleet Schedule & Assignment Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live vehicle assignment, plate tracking & maintenance schedules
              </p>
            </div>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Confirmed Booking
          </span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Maintenance Hold
          </span>
          <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Available Slot
          </span>
        </div>
      </div>

      {/* Grid Calendar Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider">
              <th className="p-3.5 min-w-[200px]">Vehicle & Plate</th>
              <th className="p-3.5">Status</th>
              {DAYS.map((d) => (
                <th key={d} className="p-3.5 text-center min-w-[130px]">
                  {d === '2026-07-30' ? 'Today (Jul 30)' : d.replace('2026-', '')}
                </th>
              ))}
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {fleet.map((veh) => (
              <tr key={veh.carId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{veh.carName}</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-bold flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    <span>{veh.plateNumber}</span> • <span>{veh.category}</span>
                  </div>
                </td>

                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${
                      veh.status === 'Assigned'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : veh.status === 'Maintenance'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {veh.status}
                  </span>
                </td>

                {DAYS.map((day) => {
                  const item = veh.schedule[day];
                  return (
                    <td key={day} className="p-2 text-center">
                      {item ? (
                        <div
                          className={`p-2 rounded-xl text-[10px] font-bold border transition-all ${
                            item.status === 'Maintenance'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          <span className="block font-black truncate">{item.customer}</span>
                          <span className="block opacity-80 font-mono text-[9px]">{item.bookingRef}</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-300 text-[10px]">
                          + Assign
                        </div>
                      )}
                    </td>
                  );
                })}

                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleToggleMaintenance(veh.carId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <Wrench className="w-3 h-3 text-amber-500" />
                    <span>{veh.status === 'Maintenance' ? 'Clear Hold' : 'Set Maint'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
