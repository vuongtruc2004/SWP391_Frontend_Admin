'use client'
import '@ant-design/v5-patch-for-react-19';
import { Checkbox, GetProp, Pagination, PaginationProps, Tooltip } from 'antd'
import { SearchProps } from 'antd/es/input'
import { Input } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';

const QuestionBank = () => {
    const { Search } = Input;
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const [questionsPage, setQuestionsPage] = useState<PageDetailsResponse<QuestionResponse[]> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [selectQuestionIds, setSelectQuestionIds] = useState<number[]>([]);

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    const handlePageChange: PaginationProps['onChange'] = (page) => {
        setCurrentPage(page);
    };

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        setKeyword(value);
        setCurrentPage(1);
    };


    useEffect(() => {
        const fetchQuestions = async () => {
            const questionPageResponse = await sendRequest<ApiResponse<PageDetailsResponse<QuestionResponse[]>>>({
                url: `${apiUrl}/questions/pagination`,
                queryParams: {
                    page: currentPage,
                    filter: `title ~ '${keyword}'`,
                    size: 10
                }
            });
            if (questionPageResponse.status === 200) {
                setQuestionsPage(questionPageResponse.data);
            }
        }
        fetchQuestions();
    }, [currentPage, keyword]);

    return (
        <>
            <Search placeholder="Tìm kiếm câu hỏi" onSearch={onSearch} style={{ width: '100% ' }} allowClear />

            <div className='flex flex-col gap-y-2 my-5'>
                {questionsPage && questionsPage.content && questionsPage.content.map(question => {
                    return (
                        <Tooltip placement='bottom' key={question.questionId} title={<ul>
                            {question.answers.map(answer => {
                                return (
                                    <li className='flex items-center gap-x-3 line-clamp-2' key={answer.answerId}>
                                        {answer.correct ? <CheckOutlined className='text-green-500' /> : <CloseOutlined className='text-red-500' />}
                                        {answer.content}
                                    </li>
                                )
                            })}
                        </ul>} >
                            <Checkbox>
                                {question.title}
                            </Checkbox>
                        </Tooltip>
                    )
                })}
                <Pagination style={{ gap: '4px' }} size='small' align='end' defaultCurrent={1} current={questionsPage?.currentPage || 1} onChange={handlePageChange} total={questionsPage?.totalElements || 1} />
            </div>
        </>
    )
}

export default QuestionBank
