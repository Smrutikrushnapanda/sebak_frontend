'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'OD';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.organization': 'Organization',
    'sidebar.masterData': 'Master Data',
    'sidebar.directory': 'Directory',
    'sidebar.keyPerson': 'Key Person',
    'sidebar.urbanDemographics': 'Urban Demographics',
    'sidebar.ruralDemographics': 'Rural Demographics',
    'sidebar.administration': 'Administration',
    'sidebar.users': 'Users',
    'sidebar.rolesPermissions': 'Roles & Permissions',
    'sidebar.settings': 'Settings',
    'sidebar.systemOnline': 'System Online',
    'sidebar.collapse': 'Collapse',
    // Dashboard
    'dashboard.goodMorning': 'Good Morning',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.grievance': 'Grievance',
    'dashboard.projects': 'Projects',
    'dashboard.issues': 'Issues',
    'dashboard.works': 'Works',
    'dashboard.appts': 'Appts',
    'dashboard.organization': 'Organization',
    'dashboard.people': 'People',
    'dashboard.hierarchy': 'Hierarchy',
    'dashboard.reports': 'Reports',
    'dashboard.funds': 'Funds',
    'dashboard.more': 'More',
    'dashboard.todaysSchedule': "Today's Schedule",
    'dashboard.viewAll': 'View All',
    'dashboard.meetings': 'Meetings',
    'dashboard.fieldVisit': 'Field Visit',
    'dashboard.events': 'Events',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.issueOverview': 'Issue Overview',
    'dashboard.inReview': 'In Review',
    'dashboard.dueSoon': 'Due Soon',
    'dashboard.overdue': 'Overdue',
    'dashboard.closed': 'Closed',
    'dashboard.workOrders': 'Work Orders',
    'dashboard.inPlanning': 'In Planning',
    'dashboard.inProgress': 'In Progress',
    'dashboard.completed': 'Completed',
    'dashboard.done': 'Done',
    'dashboard.constituencyOverview': 'Constituency Overview',
    'dashboard.openIssues': 'Open Issues',
    'dashboard.activeWorks': 'Active Works',
    'dashboard.availableFunds': 'Available Funds',
    // Sidebar extra items
    'sidebar.reminders': 'Reminders',
    'sidebar.notifications': 'Notifications',
    'sidebar.opinions': 'Opinions',
    'sidebar.importantLinks': 'Important Links',
    'sidebar.escalation': 'Escalation',
    // Bottom Nav
    'nav.home': 'Home',
    'nav.issues': 'Issues',
    'nav.works': 'Works',
    'nav.appts': 'Appts',
    'nav.more': 'More',
    // Page Titles
    'issues.title': 'Citizen Grievances',
    'workOrders.title': 'Work Orders & Infrastructure',
    'appointments.title': 'Appointments & Tour Schedule',
    'people.title': 'Citizen Directory',
    'hierarchy.title': 'Leadership & Cadre',
    'more.title': 'More',
    'more.subtitle': 'All features at your fingertips',
    'funds.title': 'Fund Management',
    'reminders.title': 'Reminders & Approvals',
    'notifications.title': 'Notifications',
    'opinions.title': 'Opinions & Surveys',
    'importantLinks.title': 'Important Links',
    'escalation.title': 'Escalation Tracker',
    'reports.title': 'Reports & Analytics',
  },
  OD: {
    // Sidebar
    'sidebar.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'sidebar.organization': 'ସଂଗଠନ',
    'sidebar.masterData': 'ମାଷ୍ଟର ଡାଟା',
    'sidebar.directory': 'ଡାଇରେକ୍ଟୋରୀ',
    'sidebar.keyPerson': 'ପ୍ରମୁଖ ବ୍ୟକ୍ତି',
    'sidebar.urbanDemographics': 'ସହରାଞ୍ଚଳ ଜନସଂଖ୍ୟା',
    'sidebar.ruralDemographics': 'ଗ୍ରାମାଞ୍ଚଳ ଜନସଂଖ୍ୟା',
    'sidebar.administration': 'ପ୍ରଶାସନ',
    'sidebar.users': 'ବ୍ୟବହାରକାରୀ',
    'sidebar.rolesPermissions': 'ଭୂମିକା ଓ ଅନୁମତି',
    'sidebar.settings': 'ସେଟିଂସ୍',
    'sidebar.systemOnline': 'ସିଷ୍ଟମ ଅନଲାଇନ୍',
    'sidebar.collapse': 'ସଙ୍କୁଚିତ',
    // Dashboard
    'dashboard.goodMorning': 'ଶୁଭ ସକାଳ',
    'dashboard.quickActions': 'ଦ୍ରୁତ କାର୍ଯ୍ୟ',
    'dashboard.grievance': 'ଅଭିଯୋଗ',
    'dashboard.projects': 'ପ୍ରକଳ୍ପ',
    'dashboard.issues': 'ସମସ୍ୟା',
    'dashboard.works': 'କାର୍ଯ୍ୟ',
    'dashboard.appts': 'ନିଯୁକ୍ତି',
    'dashboard.organization': 'ସଂଗଠନ',
    'dashboard.people': 'ଲୋକ',
    'dashboard.hierarchy': 'ପଦାନୁକ୍ରମ',
    'dashboard.reports': 'ରିପୋର୍ଟ',
    'dashboard.funds': 'ତହବିଲ',
    'dashboard.more': 'ଅଧିକ',
    'dashboard.todaysSchedule': 'ଆଜିର କାର୍ଯ୍ୟସୂଚୀ',
    'dashboard.viewAll': 'ସବୁ ଦେଖନ୍ତୁ',
    'dashboard.meetings': 'ବୈଠକ',
    'dashboard.fieldVisit': 'କ୍ଷେତ୍ର ପରିଦର୍ଶନ',
    'dashboard.events': 'କାର୍ଯ୍ୟକ୍ରମ',
    'dashboard.recentActivity': 'ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟାଳୟ',
    'dashboard.issueOverview': 'ସମସ୍ୟା ସାରାଂଶ',
    'dashboard.inReview': 'ସମୀକ୍ଷାଧୀନ',
    'dashboard.dueSoon': 'ଶୀଘ୍ର ଆସୁଛି',
    'dashboard.overdue': 'ବିଳମ୍ବିତ',
    'dashboard.closed': 'ବନ୍ଦ',
    'dashboard.workOrders': 'କାର୍ଯ୍ୟ ଆଦେଶ',
    'dashboard.inPlanning': 'ଯୋଜନାଧୀନ',
    'dashboard.inProgress': 'ଚାଲୁଛି',
    'dashboard.completed': 'ସମ୍ପୂର୍ଣ୍ଣ',
    'dashboard.done': 'ହୋଇଛି',
    'dashboard.constituencyOverview': 'ନିର୍ବାଚନ ମଣ୍ଡଳୀ ସାରାଂଶ',
    'dashboard.openIssues': 'ଖୋଲା ସମସ୍ୟା',
    'dashboard.activeWorks': 'ସକ୍ରିୟ କାର୍ଯ୍ୟ',
    'dashboard.availableFunds': 'ଉପଲବ୍ଧ ତହବିଲ',
    // Sidebar extra items
    'sidebar.reminders': 'ସମ୍ଝାଣୀ',
    'sidebar.notifications': 'ବିଜ୍ଞପ୍ତି',
    'sidebar.opinions': 'ମତାମତ',
    'sidebar.importantLinks': 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଲିଙ୍କ',
    'sidebar.escalation': 'ଏସ୍କାଲେସନ୍',
    // Bottom Nav
    'nav.home': 'ହୋମ୍',
    'nav.issues': 'ସମସ୍ୟା',
    'nav.works': 'କାର୍ଯ୍ୟ',
    'nav.appts': 'ନିଯୁକ୍ତି',
    'nav.more': 'ଅଧିକ',
    // Page Titles
    'issues.title': 'ନାଗରିକ ଅଭିଯୋଗ',
    'workOrders.title': 'କାର୍ଯ୍ୟ ଆଦେଶ ଓ ଭିତ୍ତିଭୂମି',
    'appointments.title': 'ନିଯୁକ୍ତି ଓ ଭ୍ରମଣ ସୂଚୀ',
    'people.title': 'ନାଗରିକ ନିର୍ଦ୍ଦେଶିକା',
    'hierarchy.title': 'ନେତୃତ୍ୱ ଓ କାର୍ଯ୍ୟକର୍ତ୍ତା',
    'more.title': 'ଅଧିକ',
    'more.subtitle': 'ଆପଣଙ୍କ ହାତ ପାଖରେ ସମସ୍ତ ସୁବିଧା',
    'funds.title': 'ତହବିଲ ପରିଚାଳନା',
    'reminders.title': 'ସମ୍ଝାଣୀ ଓ ଅନୁମୋଦନ',
    'notifications.title': 'ବିଜ୍ଞପ୍ତି',
    'opinions.title': 'ମତାମତ ଓ ସର୍ବେକ୍ଷଣ',
    'importantLinks.title': 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଲିଙ୍କ',
    'escalation.title': 'ଏସ୍କାଲେସନ୍ ଟ୍ରାକର',
    'reports.title': 'ରିପୋର୍ଟ ଓ ବିଶ୍ଳେଷଣ',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('app_language') as Language;
    if (saved === 'EN' || saved === 'OD') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['EN']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
