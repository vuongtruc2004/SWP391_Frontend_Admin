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
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
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