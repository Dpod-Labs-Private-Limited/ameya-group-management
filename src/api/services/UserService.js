import { AxiosObj, setBaseUrl, setToken } from "../configurations/axios-setup";

class dpodappFlyteApi {


    constructor() {
        this.accountId = null;
        this.subscriberId = null;
        this.subscriptionId = null;
        this.schema_id = null;
    }

    async initialize(appflyte_details) {
        this.accountId = appflyte_details.appflyte_account_id;
        this.subscriberId = appflyte_details.appflyte_subscriber_id;
        this.subscriptionId = appflyte_details.appflyte_subscription_id;
        this.schema_id = appflyte_details.appflyte_schema_id;
        const appflyte_backend_url = appflyte_details.appflyte_backend_url;
        const appflyte_dpod_token = appflyte_details.appflyte_dpod_token;
        setBaseUrl(appflyte_backend_url);
        setToken(appflyte_dpod_token)
    }

    getAll = async (appflyte_details, last_evaluated_key) => {
        await this.initialize(appflyte_details);
        return AxiosObj.get(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/users?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=500&include_detail=false`)
    }

}

const UserApi = new dpodappFlyteApi();
export default UserApi;