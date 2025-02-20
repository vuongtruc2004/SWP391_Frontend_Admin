'use client'

import { validIntroduction, validLessionDes, validLessionName, validObject, validOriginPrice, validSalePercentPrice } from "@/helper/create.course.helper";
import { validTitle } from "@/helper/create.question.helper";
import { validDescription } from "@/helper/create.subject.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { CloseOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Image, Input, Modal, Space } from "antd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";


const initState: ErrorResponse = {
    error: false,
    value: ''
};

const CourseCreateBtn = (props: { coursePageResponse: PageDetailsResponse<CourseResponse[]> }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errThumbnail, setErrThumbnail] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [form] = Form.useForm();
    const [lessions, setLessions] = useState([{ content: "", correct: false, empty: true }]); // Mảng câu trả lời




    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false); // Theo dõi trạng thái đã nhấn "Tạo"
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [introduction, setIntroduction] = useState<ErrorResponse>(initState);
    const [originPrice, setOriginPrice] = useState<ErrorResponse>(initState);
    const [salePercentPrice, setSalePercentPrice] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const [object, setObject] = useState<ErrorResponse>(initState);
    const [lessionName, setLessionName] = useState<ErrorResponse>(initState);
    const [lessionDes, setLessionDes] = useState<ErrorResponse>(initState);

    const showModal = () => {
        setIsRotated(!isRotated);
        setIsModalOpen(true);
    };

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'subject');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/subjects/thumbnail`,
                method: 'POST',
                headers: {},
                body: formData
            });

            if (imageResponse.status === 200) {
                setUrlThumbnail(imageResponse.data)

            } else {
                setErrThumbnail(imageResponse.errorMessage)
            }
        }
    }

    const handleOk = async () => {
        setIsSubmitted(true); // Đánh dấu đã submit
        setLoading(true); // Bật trạng thái loading
        const isTitleValid = validTitle(title, setTitle);
        const isIntroduction = validIntroduction(introduction, setIntroduction);
        const isOriginprice = validOriginPrice(originPrice, setOriginPrice);
        const isSalePercentPrice = validSalePercentPrice(salePercentPrice, setSalePercentPrice);
        const isDescription = validDescription(description, setDescription);
        const isObject = validObject(object, setObject);
        const isLessionName = validLessionName(lessionName, setLessionName);
        const isLessionDes = validLessionDes(lessionDes, setLessionDes);
        if (!isTitleValid || !isIntroduction || !isOriginprice || !isSalePercentPrice || !isDescription || !isObject || !isLessionName || !isLessionDes) {

            setErrThumbnail("Ảnh không được để rỗng!")
            if (urlThumbnail !== "") {
                setErrThumbnail("")
                setLoading(false);
                return
            }
            setLoading(false);
            return
        }
    }

    const updateAnswer = (index: number, content: string) => {
        const newlesions = [...lessions];
        newlesions[index].content = content;
        newlesions[index].empty = content.trim() === ""; // Kiểm tra rỗng
        setLessions(newlesions);
    };

    // Xóa câu trả lời
    const removeLessions = (index: number) => {
        setLessions(lessions.filter((_, i) => i !== index));
    };

    // Thêm câu trả lời mới
    const addLession = () => {
        setLessions([...lessions, { content: "", correct: false, empty: true }]);
    };

    const handleCancel = () => {
        setTitle(initState);
        setIsSubmitted(false)
        setIsModalOpen(false);
    };

    return (
        <>
            <div>
                <Button
                    type="primary"
                    onClick={showModal}
                    className="w-fit ml-[40px] !pt-5 !pb-5"
                    icon={<PlusOutlined className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />}
                >
                    Tạo mới
                </Button>
            </div>

            <Modal
                title="Tạo khoá học"
                open={isModalOpen}
                footer={null}

            >

                <Col span={7}>
                    <span className="text-red-500 mr-2">*</span>Ảnh:
                    <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg" : ""}`}>
                        {urlThumbnail === "" ? (
                            <div className="relative w-fit">
                                <Avatar
                                    shape="square"
                                    size={120}
                                    icon={<PlusOutlined />}
                                    alt="avatar"
                                />
                                <input
                                    type="file"
                                    onChange={handleUploadFile}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{ maxWidth: "120px", maxHeight: "120px" }} // Giới hạn kích thước input file
                                />
                            </div>

                        ) : (
                            <div className="flex items-end">
                                <div className="h-[120px] w-[120px]">
                                    <Image
                                        className="h-full w-full object-contain"
                                        width="100%"
                                        height="100%"
                                        preview={{
                                            visible: isPreviewVisible,
                                            mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                            onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                        }}
                                        src={`${storageUrl}/subject`}
                                        alt="Preview"
                                    />
                                </div>

                                <SyncOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />

                                <input
                                    type="file"
                                    id="chooseFile"
                                    onChange={handleUploadFile}
                                    className="hidden"
                                />
                            </div>

                        )}
                    </div>
                    {errThumbnail !== "" && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {errThumbnail}
                        </p>
                    )}
                </Col>

                <div className="mt-4">
                    <span className="text-red-500 mr-2">*</span>Bài giảng:
                    {lessions.map((answer, index) => (
                        <div key={index} className="w-full flex gap-2 mt-2 pl-5">
                            {/* Cột chứa icon trừ */}
                            {lessions.length > 1 && (
                                <div className="flex flex-col items-center gap-2 pt-6">
                                    <MinusCircleOutlined
                                        style={{ color: 'red' }}
                                        className="text-lg cursor-pointer"
                                        onClick={() => removeLessions(index)}
                                    />
                                </div>
                            )}

                            {/* Cột chứa input */}
                            <div className="flex flex-col w-full gap-2">
                                <div className="flex flex-col">
                                    <label className="font-medium">
                                        <span className="text-red-500 mr-2">*</span>Tên:
                                    </label>
                                    <Input
                                        className={`mt-1 ${isSubmitted && answer.empty ? "border-red-500" : ""}`}
                                        placeholder={`Tên bài giảng ${index + 1}`}
                                        value={answer.content}
                                        onChange={(e) => updateAnswer(index, e.target.value)}
                                        allowClear
                                    />
                                    {isSubmitted && answer.empty && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-x-1">
                                            <WarningOutlined />
                                            Vui lòng không để trống bài giảng
                                        </p>
                                    )}
                                </div>


                                <Form
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    form={form}
                                    name="dynamic_form_complex"
                                    style={{ maxWidth: 600 }}
                                    autoComplete="off"
                                    initialValues={{ videoItems: [{}], documentItems: [{}] }} // Đặt giá trị mặc định cho video và tài liệu
                                >
                                    {/* Form.List cho video */}
                                    <Form.List name="videoItems">
                                        {(fields, { add, remove }) => (
                                            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                                {fields.map((field) => (
                                                    <Form.Item label="Video" key={field.key}>
                                                        <Form.List name={[field.name, 'list']}>
                                                            {(subFields, subOpt) => (
                                                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                    {subFields.map((subField) => (
                                                                        <Space key={subField.key}>
                                                                            <Form.Item noStyle name={[subField.name, 'first']}>
                                                                                <Input placeholder="Tiêu đề" />
                                                                            </Form.Item>
                                                                            <Form.Item noStyle name={[subField.name, 'second']}>
                                                                                <Input placeholder="Video Url" />
                                                                            </Form.Item>
                                                                            <CloseOutlined
                                                                                onClick={() => {
                                                                                    subOpt.remove(subField.name);
                                                                                }}
                                                                            />

                                                                        </Space>

                                                                    ))}
                                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                                        + Thêm video
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </Form.List>
                                                    </Form.Item>
                                                ))}
                                            </div>
                                        )}
                                    </Form.List>

                                    {/* Form.List cho tài liệu */}
                                    <Form.List name="documentItems">
                                        {(fields, { add, remove }) => (
                                            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                                {fields.map((field) => (
                                                    <Form.Item label="Tài liệu" key={field.key}>
                                                        <Form.List name={[field.name, 'list']}>
                                                            {(subFields, subOpt) => (
                                                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                    {subFields.map((subField) => (
                                                                        <Space key={subField.key}>
                                                                            <div>
                                                                                <div className="flex gap-2 mb-5">
                                                                                    <Form.Item noStyle name={[subField.name, 'first']}>
                                                                                        <Input placeholder="Tiêu đề" />
                                                                                    </Form.Item>
                                                                                    <Form.Item noStyle name={[subField.name, 'second']}>
                                                                                        <Input placeholder="Nội dung" />
                                                                                    </Form.Item>
                                                                                </div>



                                                                            </div>


                                                                            <CloseOutlined
                                                                                onClick={() => {
                                                                                    subOpt.remove(subField.name);
                                                                                }}
                                                                            />
                                                                        </Space>
                                                                    ))}
                                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                                        + Thêm tài liệu
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </Form.List>
                                                    </Form.Item>
                                                ))}
                                            </div>
                                        )}
                                    </Form.List>

                                </Form>

                            </div>
                        </div>
                    ))}
                    <Button type="dashed" onClick={addLession} icon={<PlusCircleOutlined />} className="mt-3 w-full">
                        Thêm bài giảng
                    </Button>
                </div>

                <div className="flex justify-end mt-5">
                    <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                    <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
                </div>

            </Modal>

        </>
    );
};

export default CourseCreateBtn;
