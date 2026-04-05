import { useCallback, useState } from "react";
import axios from "axios";
import { Methods } from "@/enums/methods.enums";

const useGetData = (url: string, method: Methods = Methods.GET) => {
    const [data, setData] = useState<any>({ status: '', totalResults: 0, articles: [] });
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = useCallback(async (body?: object) => {
        setLoading(true);
        setError(null);
        try {
            const fullUrl = process.env.EXPO_PUBLIC_BASE_URL + url
            
            console.log('Making request to:', fullUrl);
            console.log('Request body:', JSON.stringify(body, null, 2));
            
            const response = await axios({
                method: method,
                url: fullUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                data: body,
            });
            console.log('Response:', response.data);
            setData(response.data);
        } catch (err: any) {
            console.error("Error fetching data:", err.response?.data || err.message);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [url, method]);

    return { data, error, loading, fetchData };
}

export default useGetData;