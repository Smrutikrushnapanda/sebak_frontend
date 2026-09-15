'use client';

import React from 'react';
import Link from 'next/link';

export function Navigation() {
  const navItems = [
    { label: 'Dashboard', path: '/mobile/dashboard' },
    { label: 'Issues', path: '/mobile/issues' },
    { label: 'Work Orders', path: '/mobile/work-orders' },
    { label: 'Appointments', path: '/mobile/appointments' },
    { label: 'Funds', path: '/mobile/funds' },
    { label: 'Reminders', path: '/mobile/reminders' },
    { label: 'Notifications', path: '/mobile/notifications' },
    { label: 'Opinions', path: '/mobile/opinions' },
    { label: 'Important Links', path: '/mobile/important-links' },
    { label: 'Escalation', path: '/mobile/escalation' },
    { label: 'Reports', path: '/mobile/reports' },
    { label: 'Hierarchy', path: '/mobile/hierarchy' },
    { label: 'Organization', path: '/mobile/people' },
  ];

  return (
    <nav className="p-3 border-b bg-slate-50">
      <ul className="flex flex-wrap gap-3 text-xs font-semibold">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path} className="hover:underline text-blue-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
