import { AxiosObj, setBaseUrl, setToken } from "../configurations/axios-setup";
import UpdateHeaders from "./UpdateHeaderService";

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
        const organization_id = appflyte_details?.appflyte_organization_id ?? null;
        const queryObj = [{
            field_name: "payload.organizations",
            field_value: organization_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/groups?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=500&include_detail=false`)
    }

    getAllMembers = async (appflyte_details, last_evaluated_key) => {
        await this.initialize(appflyte_details);
        return AxiosObj.get(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/group_members?filters=null&last_evaluated_key=${last_evaluated_key}&page_size=500&include_detail=false`)
    }

    getByGid = async (appflyte_details, last_evaluated_key, group_id) => {
        await this.initialize(appflyte_details);
        const queryObj = [{
            field_name: "payload.group",
            field_value: group_id,
            operator: "like"
        }]
        const queyString = encodeURIComponent(JSON.stringify(queryObj))
        return AxiosObj.get(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/group_members?filters=${queyString}&last_evaluated_key=${last_evaluated_key}&page_size=500&include_detail=false`)
    }

    addMembers = async (appflyte_details, reqObj) => {
        await this.initialize(appflyte_details);
        return AxiosObj.post(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/group_members`, reqObj)
    }

    updateMembers = async (appflyte_details, item_id, update_key, reqObj) => {
        await this.initialize(appflyte_details);
        const { hashHex, etagRandomNumber } = await UpdateHeaders(update_key);
        return AxiosObj.put(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/group_member/${item_id}`, reqObj, {
            headers: {
                'etag-hash': hashHex,
                'etag-random-number': etagRandomNumber,
            }
        })
    }

    deleteMembers = async (appflyte_details, item_id) => {
        await this.initialize(appflyte_details);
        return AxiosObj.delete(`/${this.accountId}/admin/api/collection/${this.accountId}/user/private/cm/v1/${this.schema_id}/group_member/${item_id}`)
    }

}

const GroupApi = new dpodappFlyteApi();
export default GroupApi;