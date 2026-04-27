import * as ImageManipulator from 'expo-image-manipulator';

const useUtils = () => {
    const manipulateImage = async (uri: string, width: number) => {
        return await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: width } }], // resize to max width of 500px, height will be proportional
            { 
                compress: 0.8, // compression quality (0-1)
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true // Get base64 string directly
            }
        );
    }

    const getBase64FromUri = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                // Remove data URL prefix to get just the base64 string
                const base64String = base64.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    return {
        manipulateImage,
        getBase64FromUri
    }
}

export default useUtils;