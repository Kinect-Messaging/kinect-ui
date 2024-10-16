import React from 'react';
import { IoMdGlobe } from 'react-icons/io';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from 'react-icons/md';

const routes = [
  {
    name: 'Journeys',
    layout: '/admin',
    icon: <MdBarChart className="h-6 w-6" />,
    path: 'journeys',
  },
  {
    name: 'Messages',
    layout: '/admin',
    icon: <MdPerson className="h-6 w-6" />,
    path: 'messages',
  },
  {
    name: 'Environments',
    layout: '/admin',
    icon: <IoMdGlobe className="h-6 w-6" />,
    path: 'environments',
  },
  {
    name: 'Journey Flow Placeholder',
    layout:'/admin',
    icon: <IoMdGlobe className="h-6 w-6" />,
    path: 'journeys/journey-flow',
  },
  {
    name: 'Journey Flow Editor Placeholder',
    layout: '/admin',
    icon: <IoMdGlobe className="h-6 w-6" />,
    path: 'journeys/journey-flow-editor',
  }
  // {
  //   name: 'Main Dashboard',
  //   layout: '/admin',
  //   path: 'default',
  //   icon: <MdHome className="h-6 w-6" />,
  // },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: 'nft-marketplace',
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,

  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: 'data-tables',
  // },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: 'profile',
  //   icon: <MdPerson className="h-6 w-6" />,
  // },
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: 'sign-in',
  //   icon: <MdLock className="h-6 w-6" />,
  // },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: 'rtl-default',
  //   icon: <MdHome className="h-6 w-6" />,
  // },
];
export default routes;
