import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type DashboardData = {
  totalCampaigns: number;
  averagePlacesPerCampaign: number;
  totalCreditSpent: number;
  totalEmailsSent: number;
};

export default function DashboardAdminPanel() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchDashboardData = async (selectedRange: string) => {
    setLoading(true);
    try {
      const params =
        selectedRange === 'all'
          ? ''
          : `?range=${selectedRange === '7d' ? 7 : 30}`;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/campaigns/admin/dashboard${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  const exportToPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleString();

    doc.setFontSize(20);
    doc.text(t('dashboard.title'), 14, 20);

    doc.setFontSize(14);
    doc.text(t('dashboard.general_stats'), 14, 35);

    const stats = [
      [t('dashboard.total_campaigns'), data.totalCampaigns],
      [
        t('dashboard.average_places_per_campaign'),
        data.averagePlacesPerCampaign.toFixed(2),
      ],
      [t('dashboard.total_credit_spent'), data.totalCreditSpent],
      [t('dashboard.total_emails_sent'), data.totalEmailsSent],
    ];

    doc.setFontSize(12);
    stats.forEach(([label, value], i) => {
      doc.text(`${label}: ${value}`, 14, 50 + i * 10);
    });

    doc.setFontSize(10);
    doc.text(`${t('dashboard.generated_on')} ${formattedDate}`, 14, 105);

    if (range === '7d') {
      doc.text(t('dashboard.range_last_7_days'), 14, 112);
    } else if (range === '30d') {
      doc.text(t('dashboard.range_last_30_days'), 14, 112);
    }

    doc.save('informe_dashboard_markora.pdf');
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">
        📊 {t('dashboard.report_title')}
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
        {/* Dropdown custom */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full sm:w-[200px] px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 flex justify-between items-center hover:bg-gray-100"
          >
            {range === 'all'
              ? t('dashboard.all_data')
              : range === '30d'
                ? t('dashboard.last_30_days')
                : t('dashboard.last_7_days')}
            <span className="ml-2">▾</span>
          </button>

          {dropdownOpen && (
            <ul className="absolute left-0 mt-1 z-10 w-full sm:w-[200px] bg-white border border-gray-300 rounded-md shadow-lg text-sm">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setRange('all');
                    setDropdownOpen(false);
                  }}
                >
                  {t('dashboard.all_data')}
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setRange('30d');
                    setDropdownOpen(false);
                  }}
                >
                  {t('dashboard.last_30_days')}
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setRange('7d');
                    setDropdownOpen(false);
                  }}
                >
                  {t('dashboard.last_7_days')}
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* PDF Export button */}
        <button
          onClick={exportToPDF}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-accent)] transition text-sm font-medium w-full sm:w-auto"
        >
          📥 {t('dashboard.export_as_pdf')}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <span className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <p className="text-center text-red-600 font-medium mt-6">
          {t('dashboard.error_loading_data')}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-md border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {t('dashboard.total_campaigns')}
            </p>
            <p className="text-3xl font-semibold text-[var(--color-primary)]">
              {data.totalCampaigns}
            </p>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {t('dashboard.average_places_per_campaign')}
            </p>
            <p className="text-3xl font-semibold text-[var(--color-primary)]">
              {data.averagePlacesPerCampaign.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {t('dashboard.total_credit_spent')}
            </p>
            <p className="text-3xl font-semibold text-green-600">
              💰 {data.totalCreditSpent}
            </p>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              {t('dashboard.total_emails_sent')}
            </p>
            <p className="text-3xl font-semibold text-blue-600">
              ✉️ {data.totalEmailsSent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
