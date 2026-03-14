import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { earningsCalendar } from '../data/earningsData';
import { companies } from '../data/companies';

const EVENT_STYLES = {
  earnings: 'bg-emerald-500',
  dividend_ex: 'bg-blue-500',
  dividend_pay: 'bg-orange-500',
};

export default function EarningsCalendar() {
  const { t, language } = useLanguage();

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(end.getDate() + 90);

    return earningsCalendar
      .filter((ev) => {
        const d = new Date(ev.date);
        return d >= today && d <= end;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (language === 'ja') return `${d.getMonth() + 1}/${d.getDate()}`;
    if (language === 'zh') return `${d.getMonth() + 1}/${d.getDate()}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEventLabel = (ev) => {
    if (ev.type === 'earnings') return `${ev.quarter}${t('earnings.earningsLabel')}`;
    if (ev.type === 'dividend_ex') return t('earnings.dividendEx');
    return t('earnings.dividendPay');
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
      {upcomingEvents.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] py-4 text-center">{t('common.noData')}</p>
      )}
      {upcomingEvents.map((ev, i) => {
        const company = companies.find((c) => c.id === ev.companyId);
        if (!company) return null;
        return (
          <Link
            key={`${ev.companyId}-${ev.type}-${ev.date}-${i}`}
            to={`/company/${ev.companyId}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-color)] hover:border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]/30 transition-all duration-200"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_STYLES[ev.type]}`} />
            <span className="text-lg shrink-0">{company.logo}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {company.name[language]}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">{getEventLabel(ev)}</p>
            </div>
            <span className="text-xs text-[var(--text-muted)] shrink-0 font-mono">
              {formatDate(ev.date)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
