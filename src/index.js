import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import ThemeProviderWrapper from './styles/theme/ThemeProviderWrapper';
import GroupManagement from "./containers/main";

const renderGroupManagementUI = (theme, props) => {
    let rootElement = document.getElementById('dpod-group-management');

    if (!rootElement) {
        rootElement = document.createElement('div');
        rootElement.id = 'dpod-group-management';
        document.body.appendChild(rootElement);
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <ThemeProviderWrapper theme={theme}>
            <GroupManagement {...props} />
        </ThemeProviderWrapper>
    );
};

window.GroupManagement = (function () {
    return function (theme, config) {
        renderGroupManagementUI(theme, config);
    };
})();

export default window.GroupManagement;