import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

interface Customer {
  id: string;
  image: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  address: string;
  title: string;
}

function DatabaseView({
  toggleNavbar,
  setIsSidePanelOpen,
  activeView,
  onNavClick,
}: {
  toggleNavbar: () => void;
  setIsSidePanelOpen: (isOpen: boolean) => void;
  activeView?: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [scannedCards, setScannedCards] = useState<Customer[]>([]);
  const [scannedLoading, setScannedLoading] = useState(false);
  const [scannedError, setScannedError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const controller = new AbortController();
    const fetchScanned = async () => {
      setScannedLoading(true);
      setScannedError(null);
      try {
        const res = await fetch('http://localhost:8000/scanned-cards', { signal: controller.signal });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        console.log('Fetched scanned cards:', data.data);
        setScannedCards(Array.isArray(data.data) ? data.data : [data.data]);
      } catch (err: any) {
        if (err.name !== 'AbortError') setScannedError(err.message || 'Failed to fetch scanned cards');
      } finally {
        setScannedLoading(false);
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchScanned();
    return () => controller.abort();
  }, []);

  // Filter data based on search query and filter type
  const filteredData = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();
  return scannedCards.filter((c) => {
    const matchesSearch =
      q === '' ||
      (c.name?.toLowerCase().includes(q) || '') ||
      (c.company?.toLowerCase().includes(q) || '') ||
      (c.email?.toLowerCase().includes(q) || '');
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && c.status === 'active') ||
      (filterType === 'inactive' && c.status === 'inactive');
    return matchesSearch && matchesFilter;
  });
  }, [searchQuery, filterType, scannedCards]);

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, filteredData.length);

  const visibleRows = filteredData.slice(start - 1, end);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

  const handleRowClick = (customer: Customer) => {
    setSelected(customer);
    setIsSidePanelOpen(true); // Open side panel
    toggleNavbar(); // Collapse navbar
  };

  const closeSidePanel = () => {
    setSelected(null);
    setIsSidePanelOpen(false); // Close side panel
  };

  return (
    <div className="flex flex-col sm:flex-row h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-800">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-600 text-base sm:text-lg">Loading data...</p>
        </div>
      ) : (
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Header card with search, filters and add button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white/70 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 border border-gray-200 shadow-lg">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-2xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm sm:text-base"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-medium text-xs sm:text-sm border flex-1 sm:flex-none ${filterType === 'all' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('active')}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-medium text-xs sm:text-sm border flex-1 sm:flex-none ${filterType === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterType('inactive')}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-medium text-xs sm:text-sm border flex-1 sm:flex-none ${filterType === 'inactive' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="ml-0 sm:ml-4 self-stretch sm:self-auto">
                <button className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:opacity-95 text-sm sm:text-base">+</button>
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {scannedLoading ? (
                <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">Loading...</div>
              ) : scannedError ? (
                <div className="p-4 sm:p-6 text-center text-red-600 text-sm sm:text-base">{scannedError}</div>
              ) : filteredData.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">No results found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto min-w-[640px]">
                    <thead className="text-gray-600 text-xs sm:text-sm bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 sm:px-6 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 sm:px-6 font-semibold">Company</th>
                        <th className="text-left py-3 px-4 sm:px-6 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 sm:px-6 font-semibold">Phone</th>
                        <th className="text-left py-3 px-4 sm:px-6 font-semibold">Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => handleRowClick(c)}
                          className="cursor-pointer hover:bg-green-50 transition-colors border-b border-gray-100"
                        >
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-800">{c.name}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-800">{c.company}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-800">{c.email}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-800">{c.phone}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base text-gray-800">{c.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 border-t border-gray-200 bg-white/50 rounded-b-3xl">
              <div className="text-xs sm:text-sm text-gray-600">
                {start}-{end} of {filteredData.length} results
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-2 sm:px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  ‹
                </button>
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs sm:text-sm ${p === page ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className="px-2 sm:px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side panel */}
      {selected && (
        <div className="w-full sm:w-96 border-t sm:border-t-0 sm:border-l border-gray-200 bg-white/80 backdrop-blur-xl p-4 sm:p-6 relative">
          {/* Close Button */}
          <button
            onClick={closeSidePanel}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Section */}
          <div className="mb-4 sm:mb-6 pr-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">{selected.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600">{selected.title}</p>
          </div>

          {/* Uploaded Files Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-800 truncate">{selected.image}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 p-1 rounded"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Email:</span>
                <span className="text-xs sm:text-sm text-gray-800 text-right break-all">{selected.email}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Phone:</span>
                <span className="text-xs sm:text-sm text-gray-800 text-right">{selected.phone}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Company:</span>
                <span className="text-xs sm:text-sm text-gray-800 text-right break-all">{selected.company}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => console.log('Edit user')}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 text-sm sm:text-base"
          >
            Edit User
          </button>

          {/* Danger Zone Section */}
          <div className="mt-4 sm:mt-6">
            <h3 className="text-xs sm:text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
            <button
              onClick={() => console.log('Delete user')}
              className="w-full px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 text-sm sm:text-base"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatabaseView;