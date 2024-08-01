// SidebarFooter.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SidebarButton from './SidebarButton';

const SidebarFooter = ({ isCollapsed, handleOpenNewChatModal, handleLogout }) => {
  return (
    <div className="p-4 space-y-2">
      <SidebarButton
        onClick={handleOpenNewChatModal}
        icon={faPlus}
        text="New Chat"
        isCollapsed={isCollapsed}
        className="bg-blue-500 hover:bg-blue-600"
      />
      <SidebarButton
        onClick={handleLogout}
        icon={faSignOutAlt}
        text="Logout"
        isCollapsed={isCollapsed}
        className="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default SidebarFooter;