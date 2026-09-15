'use client';

import React from 'react';
import {
  LuLayoutDashboard,
  LuNetwork,
  LuLayers,
  LuUsers,
  LuStar,
  LuShield,
  LuUserCheck,
  LuKey,
  LuSettings,
  LuBuilding,
  LuBuilding2,
  LuLandmark,
  LuFilePlus2,
  LuMapPin,
  LuHouse,
  LuVote,
  LuFileText,
  LuChevronRight,
  LuChevronDown,
  LuLogOut,
  LuUser,
  LuPlus,
  LuSearch,
  LuFilter,
  LuDownload,
  LuTrash2,
  LuPencil,
  LuEye,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuPhone,
  LuMail,
  LuCloudUpload,
  LuMap,
  LuChartPie,
  LuChartBar,
  LuActivity,
  LuTrendingUp,
} from 'react-icons/lu';
import { HiOutlineUserGroup, HiOutlineBuildingOffice2 } from 'react-icons/hi2';

const iconMap: Record<string, React.ElementType> = {
  LuLayoutDashboard: LuHouse,
  LuNetwork,
  LuLayers,
  LuUsers,
  LuStar,
  LuShield,
  LuUserCheck,
  LuKey,
  LuSettings,
  LuBuilding,
  LuBuilding2,
  LuLandmark,
  LuFilePlus2,
  LuMapPin,
  LuHome: LuHouse,
  LuHouse,
  LuVote,
  LuFileText,
  LuChartPie,
  LuChartBar,
  LuBarChart3: LuChartBar,
  LuActivity,
  LuTrendingUp,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
};

export function resolveIcon(iconName?: string | null, className: string = 'w-5 h-5') {
  if (!iconName) return <LuLayers className={className} />;
  const IconComponent = iconMap[iconName] || LuLayers;
  return <IconComponent className={className} />;
}
