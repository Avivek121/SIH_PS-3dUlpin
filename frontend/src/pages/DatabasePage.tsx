import React, { useState, useEffect } from 'react';
import { Database, Table, RefreshCw, Search, Download, ExternalLink, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useThemeStore } from '../store/themeStore';

interface TableInfo {
  table_name: string;
  row_count: number;
  status: string;
}

interface DatabaseOverview {
  engine: string;
  database_name: string;
  host: string;
  user: string;
  status: string;
  tables: TableInfo[];
}

export default function DatabasePage() {
  const { t, theme } = useThemeStore();
  const [overview, setOverview] = useState<DatabaseOverview | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('ulpins');
  const [tableData, setTableData] = useState<{ columns: string[]; rows: Record<string, any>[]; total_records: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<DatabaseOverview>('/database/overview');
      setOverview(res.data);
    } catch (err) {
      console.error('Failed to load database overview', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    try {
      setTableLoading(true);
      const res = await apiClient.get(`/database/table/${tableName}?limit=100`);
      setTableData(res.data);
    } catch (err) {
      console.error(`Failed to load data for ${tableName}`, err);
    } finally {
      setTableLoading(false);
    }
  };

  const filteredRows = (tableData?.rows || []).filter((row) => {
    if (!search.trim()) return true;
    return Object.values(row).some((val) => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-600/20 text-cyan-400 border border-cyan-500/40 rounded-2xl shadow-inner">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {t('databaseExplorerTitle')}
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
                {overview?.status || t('databaseConnected')}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
              <span>Engine: <strong className="text-cyan-300">{overview?.engine || 'PostgreSQL 18.6'}</strong></span>
              <span>•</span>
              <span>Database: <strong className="text-blue-300">{overview?.database_name || 'ulpin3d'}</strong></span>
              <span>•</span>
              <span>Host: <strong className="text-slate-300">{overview?.host || 'localhost:5432'}</strong></span>
              <span>•</span>
              <span>User: <strong className="text-slate-300">{overview?.user || 'postgres'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { loadOverview(); if (selectedTable) loadTableData(selectedTable); }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 ${tableLoading ? 'animate-spin' : ''}`} />
            <span>{t('refreshBtn')}</span>
          </button>
          <a
            href="http://localhost:8000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Swagger API ↗</span>
          </a>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <span>{t('selectDatabaseTable')}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {(overview?.tables || [
            { table_name: 'ulpins', row_count: 179 },
            { table_name: 'buildings', row_count: 8 },
            { table_name: 'property_units', row_count: 178 },
            { table_name: 'parcels', row_count: 5 },
            { table_name: 'floors', row_count: 52 },
            { table_name: 'owners', row_count: 12 },
            { table_name: 'validation_records', row_count: 6 },
            { table_name: 'datasets', row_count: 4 },
            { table_name: 'users', row_count: 7 }
          ]).map((tbl) => (
            <button
              key={tbl.table_name}
              onClick={() => setSelectedTable(tbl.table_name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedTable === tbl.table_name
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tbl.table_name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                selectedTable === tbl.table_name ? 'bg-slate-950/40 text-slate-900 font-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {tbl.row_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Table Records View */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white capitalize">
              {t('liveTableRecords')}: <span className="text-cyan-400 font-mono">{selectedTable}</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {tableData?.total_records || 0} {t('totalRecordsCount')}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('searchRecordsPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* The Grid / Table */}
        {tableLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> Querying PostgreSQL database...
          </div>
        ) : !tableData || tableData.columns.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No records found in this table.</div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar border border-slate-800/80 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-950/90 sticky top-0 border-b border-slate-800 text-[11px] font-mono text-cyan-300 uppercase tracking-wider z-10">
                <tr>
                  <th className="p-3 border-r border-slate-800/60 w-12 text-center text-slate-500">#</th>
                  {tableData.columns.map((col) => (
                    <th key={col} className="p-3 border-r border-slate-800/60 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-950/20 transition-colors">
                    <td className="p-2.5 text-center text-slate-500 border-r border-slate-800/40">{idx + 1}</td>
                    {tableData.columns.map((col) => (
                      <td key={col} className="p-2.5 border-r border-slate-800/40 whitespace-nowrap text-slate-300">
                        {row[col] === null ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : String(row[col]).length > 40 ? (
                          <span title={String(row[col])}>{String(row[col]).slice(0, 38)}...</span>
                        ) : (
                          String(row[col])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Terminal Query Guide */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" /> Connect via Terminal CLI or GUI Client
          </div>
          <p className="text-slate-400 text-[11px]">
            You can also connect using pgAdmin, DBeaver, or TablePlus at <code className="text-cyan-300 font-mono">localhost:5432</code>, database <code className="text-cyan-300 font-mono">ulpin3d</code>, user <code className="text-cyan-300 font-mono">postgres</code>.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-cyan-300 select-all">
          psql -U postgres -d ulpin3d
        </div>
      </div>
    </div>
  );
}

