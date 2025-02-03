const fetchAllSubjectApi = () => {
    const URL_BACKEND = "http://localhost:8386/api/v1/subjects";
    const responseRaw = fetch(URL_BACKEND)
    return responseRaw
}

const updateSubjectAPI = (subjetcId_raw: string, subjectName: string, description: string): Promise<Response> => {
    const URL_BACKEND = `http://localhost:8386/api/v1/subjects/update-subject/${subjetcId_raw}`;
    var subjetcId = Number.parseInt(subjetcId_raw)
    const data = {
        subjetcId: subjetcId,
        subjectName: subjectName,
        description: description
    }

    const responseRaw = fetch(URL_BACKEND, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return responseRaw
}

const deleteSubjectApi = (subjetcId: string) => {
    const URL_BACKEND = `http://localhost:8386/api/v1/subjects/delete/${subjetcId}`;
    const responseRaw = fetch(URL_BACKEND, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    return responseRaw
}

import queryString from "query-string";

interface IProps {
    url: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: RequestCache | any;
}
export const sendRequest = async <T>(props: IProps) => {
    let url = props.url;
    const {
        method = "GET",
        body,
        queryParams,
        useCredentials = false,
        headers,
        nextOption
    } = props;

    const options = {
        method: method,
        headers: {
            ...headers
        },
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };

    if (useCredentials) {
        options.credentials = "include";
    }

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(response => response.json() as T);
}

export { fetchAllSubjectApi, updateSubjectAPI, deleteSubjectApi }