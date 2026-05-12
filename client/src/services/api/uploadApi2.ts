import { baseApi } from "./baseApi";



export const uploadApi2 = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadFromServer: builder.mutation<any, {file: Blob, uploadId: string}>({
            query:({file, uploadId}) => ({
                url: `/upload/image`,
                method: "POST",
                body: {
                    file,
                    uploadId
                }
            })
        })
    })
})

export const {useUploadFromServerMutation} = uploadApi2;