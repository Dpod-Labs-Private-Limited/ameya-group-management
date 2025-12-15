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

    const hardcodedProps = {
        appflyte_schema_id: "ameya_appflyte",
        appflyte_backend_url: "https://appflyte-backend.ameya.ai",
        appflyte_account_id: "0aee6bd7-ed42-4184-9bac-ce0466737ada",
        appflyte_subscriber_id: "6551f605-39cb-4351-8ea1-b2a7af317985",
        appflyte_subscription_id: "a6a49ce0-1121-455c-91cd-7956eb0891dd",
        appflyte_organization_id: "c357f357-f946-42fe-b9b0-b64feb93cf0c",
        appflyte_dpod_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aGlyZF9wYXJ0eV90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW10cFpDSTZJbVZsWXpVek5HWmhOV0k0WTJGallUSXdNV05oT0dRd1ptWTVObUkxTkdNMU5qSXlNVEJrTVdVaUxDSjBlWEFpT2lKS1YxUWlmUS5leUpwYzNNaU9pSmhZMk52ZFc1MGN5NW5iMjluYkdVdVkyOXRJaXdpWVhwd0lqb2lPVGd6TURrME5qVTJOakV3TFRsdE5YRnJabTFrTUdZMVltYzBiWEUxTTJWbE9YVXhNalF5TW5RME1XeG5MbUZ3Y0hNdVoyOXZaMnhsZFhObGNtTnZiblJsYm5RdVkyOXRJaXdpWVhWa0lqb2lPVGd6TURrME5qVTJOakV3TFRsdE5YRnJabTFrTUdZMVltYzBiWEUxTTJWbE9YVXhNalF5TW5RME1XeG5MbUZ3Y0hNdVoyOXZaMnhsZFhObGNtTnZiblJsYm5RdVkyOXRJaXdpYzNWaUlqb2lNVEV5TURnd016TTROREU1TXpRMk9ETTNOemcxSWl3aVpXMWhhV3dpT2lKa1pXVnJjMmhwZEdnM09ESXdRR2R0WVdsc0xtTnZiU0lzSW1WdFlXbHNYM1psY21sbWFXVmtJanAwY25WbExDSmhkRjlvWVhOb0lqb2lPWGxTZHpCVmFteEhXbTk0U1c5bVNtaHlSRTl2WnlJc0ltbGhkQ0k2TVRjek9UTTBOVEU1T0N3aVpYaHdJam94TnpNNU16UTROems0ZlEuVXZEUWFmRUpSX1dDX2U2QlVWalZPZExxX2lXenBiaE11a1V0U1p2cHhKdTJZOEJ5ODgyMGx3SmJabEJVd25NVXlIbWMxeE5qNEtiUTQxNU4wYnJGMHZ5Ymlzd0tNejlQVUVUTmYzZjhtQmYxWHZwN0M3VE5lbE4tRE9rZTlfZk4xVTNQMnpJS1pOdl9adnN1cU9FdWpLV0ZSOFJ5ZzA0ZGZqQlRqZlBwelJPb3o5Ql9zZm1FUTc4VlhnYkEzajUwWkhjTUs0M0xhRU5VS3N3VDk5WlBuSDNCZTdVc0lCOGl2bWNPM1ItUm9GemlfRkx1ZjdGS2ltdGhqd25zeUVhOVR6WWlNa2pnTDJidVJ1bUg5YUlkTmJ3ekxBVHdiQnpVYm9OaVpqUmFwR1dhNHFRU0Uzc2VuWE5ncGdCQTdlQ1pTd1ZRWEpzOGJTU1NvYnQyamMzYnhBIiwic3ViIjoiNDg2ZjQ5NjgtODAzZC00NGViLWExNzctOTkzMGY3NTQxZDA3IiwiaXNzIjoiaHR0cHM6Ly93d3cuZHBvZC5pbyIsInJvb3RfYWNjb3VudF9pZCI6IjBhZWU2YmQ3LWVkNDItNDE4NC05YmFjLWNlMDQ2NjczN2FkYSIsInN1YnNjcmliZXJfaWQiOiI2NTUxZjYwNS0zOWNiLTQzNTEtOGVhMS1iMmE3YWYzMTc5ODUiLCJzdWJzY3JpcHRpb25faWQiOiJhNmE0OWNlMC0xMTIxLTQ1NWMtOTFjZC03OTU2ZWIwODkxZGQiLCJleHAiOjE3MzkzNDg4MDEsImFwcF9zdWJzY3JpYmVkIjpbIkFtZXlhIl0sInByb3ZpZGVyIjoiZ29vZ2xlIiwiYXBwX3JvbGUiOltdLCJhcHBfcGVybWlzc2lvbnMiOlsiQW1leWEiXX0.u1TuNl9txncc7y014kGVI0Cu2WK6zoZ-zcfAdXjNfvQ",
    };

    const mergedProps = {
        ...hardcodedProps,
        ...props,
    };

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <ThemeProviderWrapper theme={theme}>
            <GroupManagement {...mergedProps} />
        </ThemeProviderWrapper>
    );
};

window.GroupManagement = (function () {
    return function (theme, config) {
        renderGroupManagementUI(theme, config);
    };
})();

export default window.GroupManagement;