'use client'
import '@ant-design/v5-patch-for-react-19';
import { Checkbox, CheckboxChangeEvent, Pagination, PaginationProps } from 'antd'
import { SearchProps } from 'antd/es/input'
import { Input } from 'antd';
import { useEffect, useState } from 'react'
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { useQuizUpdate } from '@/wrapper/quiz-update/quiz.update.wrapper';
const { Search } = Input;

const QuestionBank = () => {
    const { setSelectQuestions, selectQuestions } = useQuizUpdate();
    const [questionsPage, setQuestionsPage] = useState<PageDetailsResponse<QuestionResponse[]> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState("");

    const handleCheck = (e: CheckboxChangeEvent, question: QuestionResponse) => {
        setSelectQuestions(prev =>
            e.target.checked
                ? [...prev, question]
                : prev.filter(q => q.questionId !== question.questionId)
        );
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
                        <Checkbox key={question.questionId} checked={selectQuestions.some(q => q.questionId === question.questionId)} onChange={(e) => handleCheck(e, question)}>
                            {question.title}
                        </Checkbox>
                    )
                })}
                <Pagination style={{ gap: '4px' }} size='small' align='end' defaultCurrent={1} current={questionsPage?.currentPage || 1} onChange={handlePageChange} total={questionsPage?.totalElements || 1} />
            </div>
        </>
    )
}

export default QuestionBank
