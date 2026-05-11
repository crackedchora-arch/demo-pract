import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

interface uploadImageArgs{
    file: File;
    onProgress?: (progress: number) => void;
}

export const uploadApi =createApi({
    reducerPath: "uploadApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        uploadImage: builder.mutation<any, uploadImageArgs>({
            async queryFn({file, onProgress}){
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", "my_upload_preset");

                    // upload to cloudinary
                    const response = await axios.post(
                      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                      formData,
                      {
                        // upload tracking
                        onUploadProgress(progressEvent) {
                          // calculate percentage  some* 100 / total
                          const percent = Math.round(
                            (progressEvent.loaded * 100) /
                              (progressEvent.total || 1),
                          );

                          //   Send progress back to component
                          onProgress?.(percent);
                        },

                        

                      },
                    );


                    return {
                        data: response.data 
                    }
                } catch (error: any) {
                     return {
                       error: {
                         status: error.response?.status,
                         data: error.message,
                       },
                     };
                }
            }
        })
    })
})


export const {useUploadImageMutation} = uploadApi;