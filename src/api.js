const API_URL = '/api';

export const sendToBackend = async (files, action, details = {}) => {
    console.log('Sending to backend:', { action, details, fileCount: Array.isArray(files) ? files.length : 1 });
    const formData = new FormData();
    
    // If files is a single file, convert to array
    const fileArray = Array.isArray(files) ? files : [files];
    
    fileArray.forEach(file => {
        formData.append('files', file);
    });
    
    formData.append('action', action);
    formData.append('details', JSON.stringify(details));

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error data:', errorData);
            throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json();
        console.log('Backend success data:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
