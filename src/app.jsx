import React from 'react';
import "./styles/css/app.css";
import ThemeProviderWrapper from './styles/theme/ThemeProviderWrapper';
import GroupManagement from './containers/main';
function App() {

    const appflyte_schema_id = "ameya_appflyte"
    const appflyte_backend_url = "https://api-dev.appflyte.net"
    const appflyte_account_id = "cd070ed6-9934-4b5d-b9ce-103919148f89"
    const appflyte_subscriber_id = "4921ffa9-4eb5-4d87-b5bd-be9980cf3736"
    const appflyte_subscription_id = "4ec5248b-f0c5-4372-83e8-770f17917edd"
    const appflyte_organization_id = "47c2f395-db41-42a7-8b8b-2857845118f1"
    const appflyte_app_id = "7f6242d2-de2e-482d-bc67-78ae3abc476f"
    const appflyte_dpod_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aGlyZF9wYXJ0eV90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW10cFpDSTZJbU00TVRaa016TTNZamd6TmpWaE1EWmhPRFV4WVdRNE1EQXhObU14TnpFd09UazBPVEkyTURraUxDSjBlWEFpT2lKS1YxUWlmUS5leUpwYzNNaU9pSmhZMk52ZFc1MGN5NW5iMjluYkdVdVkyOXRJaXdpWVhwd0lqb2lPVGd6TURrME5qVTJOakV3TFRsdE5YRnJabTFrTUdZMVltYzBiWEUxTTJWbE9YVXhNalF5TW5RME1XeG5MbUZ3Y0hNdVoyOXZaMnhsZFhObGNtTnZiblJsYm5RdVkyOXRJaXdpWVhWa0lqb2lPVGd6TURrME5qVTJOakV3TFRsdE5YRnJabTFrTUdZMVltYzBiWEUxTTJWbE9YVXhNalF5TW5RME1XeG5MbUZ3Y0hNdVoyOXZaMnhsZFhObGNtTnZiblJsYm5RdVkyOXRJaXdpYzNWaUlqb2lNVEEwTXpjNU56SXdNakkyTnpZeU1EYzVPREV4SWl3aVpXMWhhV3dpT2lKa1pXVnJjMmhwZEdoa2NHOWtRR2R0WVdsc0xtTnZiU0lzSW1WdFlXbHNYM1psY21sbWFXVmtJanAwY25WbExDSmhkRjlvWVhOb0lqb2lVMmxUTkRRek0zTTNkamRYUkVWc2QxbHpNMHRYWnlJc0ltbGhkQ0k2TVRjM01URXpOelUyTlN3aVpYaHdJam94TnpjeE1UUXhNVFkxZlEuSUZqMFpxbU1OVHl4YU9SWXAyTGUwSk5pRUZpS3k0eDFCS2dsZy14ZGs5VzBoWnQ0bHJITmhrVk9UN1FPUHIwQnBGQmJjcHBfMlNFbWdzeEZZbW9DbFo2Q0pfbjZJYkU0ZzBXTDFrY2EwNXBqTTFOTTBsWC03NXRhSWsxTlBDYnF6TmZDS0VrNEJieFJ4cXNWaFpDT3A5eERPVUhnRkFuaVdPZFFtREpNSUgxWHVvQVB6UE12UC1LVzBqOTZpSzlFMXhaUjljMlBXT0duUU5LNnQzRFVkbUZPa2dHRFlNODVGZkNNSGZhX3RyUWt4SDl1VFUzUktyLWZYSndpS3YtZHRrdW9Lb2pwX0phQ1RQa0pYb1ZOU3hXNG5vZnlDX0NyTy1nWThWVENBMmhNNUw5WGYtcU9oYk5yckMxcnM0YzNJRVNQcFY1amQteDZlQkpSUGN2TmtBIiwic3ViIjoiMTA0Mzc5NzIwMjI2NzYyMDc5ODExIiwidXNlcl9pZCI6IjlkNTVkN2U5LTYzMTgtNGE0ZC1hMmM2LTBhMjA4YzMyZTNmZCIsImlzcyI6Imh0dHBzOi8vd3d3LmRwb2QuaW8iLCJyb290X2FjY291bnRfaWQiOiJjZDA3MGVkNi05OTM0LTRiNWQtYjljZS0xMDM5MTkxNDhmODkiLCJzdWJzY3JpYmVyX2lkIjoiNDkyMWZmYTktNGViNS00ZDg3LWI1YmQtYmU5OTgwY2YzNzM2Iiwic3Vic2NyaXB0aW9uX2lkIjoiNGVjNTI0OGItZjBjNS00MzcyLTgzZTgtNzcwZjE3OTE3ZWRkIiwidXNlcl9uYW1lIjoiRGVla3NoaXRoIEQiLCJwcm9maWxlX3Bob3RvIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSXFGT2Y1c05CeE1BRGg5eWU1Tk1Pb3JITzlneW45a1U1OS0tRHRtRGxfMnpUbHpiaz1zOTYtYyIsImV4cCI6MTc3MTE0MTE3Miwic2NoZW1hX2lkIjoiM2ZjNGM4MDgtNmVhOC00ZmE5LWFkYmQtYzEzYjhmOGRlYTQzIiwiYXBwX2lkIjoiN2Y2MjQyZDItZGUyZS00ODJkLWJjNjctNzhhZTNhYmM0NzZmIiwiYXBwX29yZ19pZCI6IjQ3YzJmMzk1LWRiNDEtNDJhNy04YjhiLTI4NTc4NDUxMThmMSIsImFwcF9zdWJzY3JpYmVkIjpbIkFtZXlhIl0sInByb3ZpZGVyIjoiZ29vZ2xlIiwiYXBwX3JvbGUiOltdLCJhcHBfcGVybWlzc2lvbnMiOlsiQW1leWEiXSwib3JnYW5pemF0aW9ucyI6WyI0N2MyZjM5NS1kYjQxLTQyYTctOGI4Yi0yODU3ODQ1MTE4ZjEiXSwib3JnYW5pemF0aW9uX293bmVycyI6eyI0N2MyZjM5NS1kYjQxLTQyYTctOGI4Yi0yODU3ODQ1MTE4ZjEiOnRydWV9fQ.N-WEsJB1GwVnhT_oMayuKvbqNLozE50wSeZU7eYTmgU"

    return (
        <div id='app'>
            <ThemeProviderWrapper>
                <GroupManagement
                    appflyte_backend_url={appflyte_backend_url}
                    appflyte_schema_id={appflyte_schema_id}
                    appflyte_account_id={appflyte_account_id}
                    appflyte_subscriber_id={appflyte_subscriber_id}
                    appflyte_subscription_id={appflyte_subscription_id}
                    appflyte_organization_id={appflyte_organization_id}
                    appflyte_app_id={appflyte_app_id}
                    appflyte_dpod_token={appflyte_dpod_token}
                />
            </ThemeProviderWrapper>
        </div >
    )
}

export default App;