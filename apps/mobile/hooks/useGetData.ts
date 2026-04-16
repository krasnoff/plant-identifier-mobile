import { useCallback, useState, useRef } from "react";
import axios from "axios";
import { Methods } from "@/enums/methods.enums";

const useGetData = (url: string, method: Methods = Methods.GET) => {
    const [data, setData] = useState<any>({ status: '', totalResults: 0, articles: [] });
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (body?: object) => {
        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        setError(null);
        try {
            const fullUrl = process.env.EXPO_PUBLIC_BASE_URL + url
            
            const response = await axios({
                method: method,
                url: fullUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                data: body,
                signal: abortControllerRef.current.signal,
            });
            setData(response.data);
        } catch (err: any) {
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                console.error('Request was canceled');
                return; // Don't set error for canceled requests
            }
            console.error("Error fetching data:", err.response?.data || err.message);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [url, method]);

    const cancelRequest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setLoading(false);
        }
    }, []);

    return { data, error, loading, fetchData, cancelRequest, setLoading };
}

export default useGetData;