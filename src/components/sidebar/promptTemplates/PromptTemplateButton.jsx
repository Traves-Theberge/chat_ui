import React from 'react';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import SidebarButton from '../SidebarButton';

const PromptTemplateButton = ({ onClick, isCollapsed }) => {
  return (
    <SidebarButton
      onClick={onClick}
      icon={faLightbulb}
      text="Prompt Templates"
      isCollapsed={isCollapsed}
      className="bg-green-600 hover:bg-green-700"
    />
  );
};

export default PromptTemplateButton;