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

    return {
        manipulateImage
    }
}

export default useUtils;