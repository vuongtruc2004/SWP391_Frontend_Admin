
import SubjectTable from "@/components/subject/subject.table"
import { apiUrl } from "@/utils/url"
import Search from "antd/es/input/Search"

const SubjectPage = async (props: {
    searchParams: Promise<{
        keyword?: string;
        page?: string;
    }>
}) => {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword || ""
    const page = searchParams.page || 1;
    // const subjectResponse = await sendRequest<ApiResponse<PageDetailsResponse<SubjectResponse[]>>>({
    //     url: `${apiUrl}/subjects/all`,
    //     queryParams: {
    //         page: 1,
    //         size: 10
    //     }
    // })


    const subjectResponseRaw = await fetch(`${apiUrl}/subjects/all?page=${page}&size=10`)
    const subjectResponse: ApiResponse<PageDetailsResponse<SubjectResponse[]>> = await subjectResponseRaw.json()

    console.log(">>> check response: ", subjectResponse);
    return (
        <div className="borde w-full h-[85vh] bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col">
            <Search
                placeholder="input search text"
                enterButton
                style={{
                    width: '40%',
                    padding: '8px',
                    margin: '30px',
                }}
            />
            {/* <SubjectCreateBtn
                dataSubject={dataSubject}
                setDataSubject={setDataSubject}

            /> */}

            <SubjectTable
                subjectPageResponse={subjectResponse.data}
            />
        </div>
    )
}
export default SubjectPage