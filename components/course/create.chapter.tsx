'use client'
import { isValidYouTubeUrl } from '@/helper/create.course.helper';
import { calculateReadingTime, extractVideoId, getYouTubeDuration } from '@/helper/get.youtube.duration.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl, storageUrl } from '@/utils/url';
import { CloseOutlined, DeleteOutlined, EditOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MDEditor, { getCommands, ICommand } from '@uiw/react-md-editor';
import { Button, Card, Form, Input, notification, Popconfirm, Select, Tabs, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from "react";
interface FormValues {
    items: [
        {
            description: string;
            title: string;
            lessons: [
                {
                    lessonDescription: string;
                    lessonTitle: string;
                    videoUrl: string;
                    documentContent: string;
                }
            ]
        }
    ]
}
const CreateChapter = ({ course }: {
    course: CourseDetailsResponse;
}) => {
    const { data: session, status } = useSession();
    const { push } = useRouter();
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState<ChapterResponse[]>([]);
    const router = useRouter();
    const deleteChapter = async (chapterId: number) => {
        const deleteResponse = await sendRequest<ApiResponse<ChapterResponse>>({
            url: `${apiUrl}/chapters/${chapterId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`
            }
        });
        console.log(deleteResponse);
        if (deleteResponse.status === 200) {
            notification.success({
                message: "Thành Công",
                description: deleteResponse.message.toString(),
            });
            router.refresh()
        } else {
            notification.error({
                message: "Thất Bại",
                description: deleteResponse.message.toString(),
            })
        }
    }
    const uploadDocument: ICommand = {
        name: "upload-document",
        keyCommand: "upload-document",
        buttonProps: { "aria-label": "Upload Document" },
        icon: <span className="text-blue-500">Upload Document</span>, // Icon hiển thị
        execute: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement);
                if (file.files && file.files[0]) {
                    const formData = new FormData();
                    formData.set("file", file.files[0]);
                    formData.set("folder", "document");
                    const docRes = await sendRequest<ApiResponse<string>>({
                        url: `${apiUrl}/files/document`,
                        method: "POST",
                        body: formData,
                    });
                    const docMarkdown = `[📄 ${file.files[0].name}](${storageUrl}/document/${docRes.data})`;
                    const currentValues = form.getFieldsValue(true);
                    const fieldIndex = 0;
                    const lessonIndex = 0;
                    if (currentValues.items[fieldIndex]?.lessons[lessonIndex]) {
                        currentValues.items[fieldIndex].lessons[lessonIndex].documentContent =
                            (currentValues.items[fieldIndex].lessons[lessonIndex].documentContent || "") + `\n${docMarkdown}\n`;

                        form.setFieldsValue(currentValues);
                        setInputMarkdown(currentValues.items[fieldIndex].lessons[lessonIndex].documentContent);
                    }

                }
            };
            input.click();
        },
    };


    console.log("check mark", inputMarkdown)
    const customCommands = [...getCommands(), uploadDocument];

    const onFinish = async (values: FormValues) => {
        if (status !== "authenticated") {
            return;
        }

        const chapterRequestList: ChapterRequest[] = [];

        for (let value of values.items) {
            if (!Array.isArray(value.lessons)) {
                notification.error({
                    message: "Lỗi",
                    description: `Chương ${value.title} chưa có bài giảng nào!`,
                });
                return;
            }
            if (value.title.split(/\s+/).length > 20) {
                notification.error({
                    message: "Lỗi",
                    description: `Chương "${value.title}" có tiêu đề vượt quá 20 từ`,
                });
                return;
            }
            if (value.description.split(/\s+/).length > 1000) {
                notification.error({
                    message: "Lỗi",
                    description: `Chương "${value.title}" có mô tả vượt quá 1000 từ`,
                });
                return;
            }

            const lessons: LessonRequest[] = [];

            for (let [index, lesson] of value.lessons.entries()) {
                if ((!lesson.videoUrl || lesson.videoUrl.trim() === "") && (!lesson.documentContent || lesson.documentContent.trim() === "")) {
                    notification.error({
                        message: "Lỗi",
                        description: `Bài giảng "${lesson.lessonTitle}" phải có tài liệu hoặc video`,
                    });
                    return;
                }
                if (lesson.lessonTitle.trim().split(/\s+/).length > 20) {
                    notification.error({
                        message: "Lỗi",
                        description: `Chương "${value.title}" - Bài ${index + 1}  có tiêu đề vượt quá 20 từ`,
                    });
                    return;
                }
                if (lesson.lessonDescription.trim().split(/\s+/).length > 20) {
                    notification.error({
                        message: "Lỗi",
                        description: `Chương "${value.title}" - Bài "${lesson.lessonTitle}" có mô tả vượt quá 1000 từ`,
                    });
                    return;
                }

                if (!isValidYouTubeUrl(lesson.videoUrl) && lesson.videoUrl) {
                    notification.error({
                        message: "Lỗi",
                        description: `Video ở chương "${value.title}" - "${lesson.lessonTitle}" có định dạng không hợp lệ ! `,
                    });
                    return;
                }
                if (lesson.videoUrl && lesson.documentContent) {
                    notification.error({
                        message: "Lỗi",
                        description: `Chương  "${value.title}" - Bài "${lesson.lessonTitle}" có nội dung không hợp lệ !`,
                    });
                    return;
                }


                const lessonReq: LessonRequest = {
                    title: lesson.lessonTitle,
                    lessonType: (!lesson.videoUrl || lesson.videoUrl.trim() === "") ? "DOCUMENT" : "VIDEO"
                };

                if (lessonReq.lessonType === "VIDEO") {
                    lessonReq.duration = await getYouTubeDuration(extractVideoId(lesson.videoUrl));
                    lessonReq.videoUrl = lesson.videoUrl;
                } else if (lessonReq.lessonType === "DOCUMENT") {
                    lessonReq.duration = calculateReadingTime(lesson.documentContent);
                    lessonReq.documentContent = lesson.documentContent;
                }
                lessons.push(lessonReq);
            }

            const chapter: ChapterRequest = {
                courseId: course.courseId,
                description: value.description,
                title: value.title,
                lessons: lessons
            };

            chapterRequestList.push(chapter);
        }

        const response = await sendRequest<ApiResponse<ChapterResponse[]>>({
            url: `${apiUrl}/chapters`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`
            },
            body: chapterRequestList
        });

        if (response.status === 201) {
            notification.success({
                message: "Thành công",
                description: "Tạo chương học thành công!",
            });
            push("/course");
        } else {
            notification.error({
                message: "Thất bại",
                description: "Tạo chương học thất bại!",
            });
        }
    };
    useEffect(() => {
        const fetchChapters = async () => {
            setLoading(true);
            try {
                const response = await sendRequest<ApiResponse<ChapterResponse[]>>({
                    url: `${apiUrl}/chapters/${course.courseId}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken}`
                    }
                });
                console.log(response);
                if (response.status === 201) {
                    setChapters(response.data);
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách chương học:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, [course, session]);

    return (
        <Form
            form={form}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            layout='vertical'
            autoComplete="off"
            initialValues={{ items: [{}] }}
            onFinish={onFinish}
        >
            <div className='mb-5 flex justify-between items-center'>
                <Link href={"/course"}>
                    <HomeOutlined style={{ fontSize: '30px', color: '#14ACED' }} />
                </Link>
            </div>
            <Form.Item
                label={<span style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>Các chương học thuộc khoá {course.courseName}</span>}
            >
                <Select
                    placeholder="Chọn chương học"
                    loading={loading}
                    // defaultValue={chapters.length > 0 ? chapters[0].chapterId : undefined}
                    style={{
                        border: '1px solid black',
                        borderRadius: '8px',
                        width: '100%'
                    }}
                >
                    {chapters.length > 0 ? (
                        chapters.map((chapter, index) => (
                            <Select.Option key={chapter.chapterId} value={chapter.chapterId}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Chương {index + 1}: {chapter.title}</span>
                                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                        <InfoCircleOutlined style={{ opacity: 0.7, color: "gray" }} />
                                        <EditOutlined style={{ opacity: 0.7, color: "blue" }} />
                                        <Tooltip placement="bottom" title='Xóa chương học'>
                                            <Popconfirm
                                                placement="left"
                                                title="Xóa chương học"
                                                description="Bạn có chắc chắn muốn xóa chương học này không?"
                                                onConfirm={() => deleteChapter(chapter.chapterId)}
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <DeleteOutlined style={{ color: "red" }} />
                                            </Popconfirm>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option disabled>Không có chương học nào</Select.Option>
                    )}
                </Select>
            </Form.Item>






            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                        {fields.map((field) => (
                            <Card
                                size="small"
                                title={<h1 className='font-semibold text-lg'>Chương {field.name + 1}</h1>}
                                key={field.key}
                                style={{ marginBottom: '20px', borderColor: '#495057', padding: '10px' }}
                                extra={field.name === 0 ? (
                                    <></>
                                ) : (
                                    <CloseOutlined
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    />
                                )
                                }
                            >
                                <Form.Item label="Tiêu đề chương học" name={[field.name, 'title']}
                                    rules={[{ required: true, message: 'Tiêu đề chương học không được để trống' }]}
                                >
                                    <Input
                                        placeholder='Nhập tiêu đề chương học'

                                    />
                                </Form.Item>

                                <Form.Item label="Mô tả chương học" name={[field.name, 'description']}
                                    rules={[{ required: true, message: 'Mô tả chương học không được để trống' }]}
                                >
                                    <TextArea rows={4} placeholder="Nhập mô tả chương học" />
                                </Form.Item>

                                {/* Nest Form.List */}
                                <Form.Item style={{ paddingInline: '20px' }}>
                                    <Form.List name={[field.name, 'lessons']}>
                                        {(subFields, subOpt) => {
                                            return (
                                                <>
                                                    {subFields.map((subField, index) => {
                                                        return (
                                                            <Fragment key={subField.key}>
                                                                <div className="flex items-center justify-between mb-2 pr-5">
                                                                    <h1 className="font-semibold">Bài giảng {index + 1}</h1>
                                                                    <CloseOutlined onClick={() => subOpt.remove(subField.name)} />
                                                                </div>
                                                                <div>
                                                                    <Form.Item
                                                                        label="Tiêu đề bài giảng"
                                                                        name={[subField.name, 'lessonTitle']}
                                                                        rules={[{ required: true, message: 'Tiêu đề bài giảng không được để trống' }]}
                                                                    >
                                                                        <Input placeholder="Nhập tiêu đề bài giảng" />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        label="Mô tả bài giảng"
                                                                        name={[subField.name, 'lessonDescription']}
                                                                        rules={[{ required: true, message: 'Mô tả bài giảng không được để trống' }]}
                                                                    >
                                                                        <TextArea rows={4} placeholder="Nhập mô tả bài giảng" />
                                                                    </Form.Item>

                                                                    <Tabs
                                                                        style={{ marginBottom: '12px' }}
                                                                        defaultActiveKey="1"
                                                                        items={[
                                                                            {
                                                                                key: '1',
                                                                                label: 'Video',
                                                                                children: (
                                                                                    <>
                                                                                        <Form.Item
                                                                                            label="Đường dẫn video bài giảng"
                                                                                            name={[subField.name, 'videoUrl']}
                                                                                        // rules={[{ required: true, message: 'Đường dẫn video bài giảng không được rỗng!' }]}
                                                                                        >
                                                                                            <Input placeholder="Nhập đường dẫn video bài giảng" />
                                                                                        </Form.Item >
                                                                                    </>
                                                                                )
                                                                            },
                                                                            {
                                                                                key: '2',
                                                                                label: 'Tài liệu tham khảo',
                                                                                children: (
                                                                                    <>
                                                                                        <Form.Item
                                                                                            label="Nội dung tài liệu"
                                                                                            name={[subField.name, 'documentContent']}
                                                                                        >
                                                                                            <MDEditor
                                                                                                value={inputMarkdown}
                                                                                                preview="edit"
                                                                                                commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
                                                                                                style={{
                                                                                                    background: '#e9ecef',
                                                                                                    color: 'black'
                                                                                                }}
                                                                                                commands={customCommands}
                                                                                            />
                                                                                        </Form.Item>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        ]}
                                                                    />
                                                                </div>
                                                            </Fragment >
                                                        );
                                                    })}
                                                    <Button variant='outlined' color='purple' onClick={() => {
                                                        subOpt.add();

                                                    }} block>
                                                        + Thêm bài giảng
                                                    </Button>
                                                </>
                                            );
                                        }}
                                    </Form.List>
                                </Form.Item>
                            </Card>
                        ))}

                        <Button variant='outlined' color='purple' onClick={() => add()} block>
                            + Thêm chương học
                        </Button>
                    </div>
                )}

            </Form.List>
            <div className='mt-5 flex justify-end gap-x-3'>
                <Link href={"/course"}>
                    <Button variant="outlined">
                        Huỷ
                    </Button>
                </Link>

                <Button type="primary" htmlType="submit"

                >
                    Tạo chương học
                </Button>
            </div>



        </Form >
    )
}

export default CreateChapter
