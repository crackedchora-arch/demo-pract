import { baseApi } from "./baseApi";



export const uploadApi2 = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadFromServer: builder.mutation<any, FormData>({
            query:(formData) => ({
                url: `/upload/image`,
                method: "POST",
                body: formData
            })
        })
    })
})

export const {useUploadFromServerMutation} = uploadApi2;