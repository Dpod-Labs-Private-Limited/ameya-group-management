import GroupApi from "../api/services/GroupService";
import UserApi from "../api/services/UserService";
import UserAppAccessApi from "../api/services/UserAppAccessService";

export const fetchGroupDetails = async (appflyte_details) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await GroupApi.getAll(appflyte_details, last_evaluated_key);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null);
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}


export const fetchUserDetails = async (appflyte_details) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await UserApi.getAll(appflyte_details, last_evaluated_key);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null);
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}

export const fetchGroupMembersByGroup = async (appflyte_details, group_id) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await GroupApi.getByGid(appflyte_details, last_evaluated_key, group_id);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null);
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}

export const fetchUserAppAccess = async (appflyte_details) => {
    const tempArr = []
    let last_evaluated_key = null
    try {
        do {
            const response = await UserAppAccessApi.getAll(appflyte_details, last_evaluated_key);
            if (response.data) {
                const collectionData = response.data.published_collections_detail.flatMap(collection => response.data[collection.id]);
                if (collectionData) {
                    tempArr.push(...collectionData)
                }
            }
            last_evaluated_key = response.data.last_evaluated_key != null && response.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(response.data.last_evaluated_key)) : null
        }
        while (last_evaluated_key !== null);
        return tempArr;
    }
    catch (error) {
        console.error(error)
        return []
    }
}