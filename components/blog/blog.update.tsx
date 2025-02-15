
import { storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { Avatar, Form, Image, Input, Modal } from "antd";
import { marked } from "marked";
import { ChangeEvent, useEffect, useState } from "react";
import TurndownService from 'turndown'

const turndownService = new TurndownService();
interface IProps {
    openUpdate: boolean,
    setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>
    selectRecord: BlogResponse | null
}
const BlogUpdate = (props: IProps) => {
    const { openUpdate, setOpenUpdate, selectRecord } = props;
    const [value, setValue] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [errThumbnail, setErrThumbnail] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState(selectRecord?.thumbnail);
    console.log("check: ", selectRecord?.thumbnail)
    useEffect(() => {
        const md = turndownService.turndown(`${selectRecord?.content}`);
        setInputMarkdown(md);
    }, [selectRecord])

    const handleOnChange = (value: any) => {
        setValue(value);
        console.log("check output: ", marked(value));
    }

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'blog');

            // const imageResponse = await sendRequest<ApiResponse<string>>({
            //     url: `${apiUrl}/subjects/thumbnail`,
            //     method: 'POST',
            //     headers: {},
            //     body: formData
            // });

            // if (imageResponse.status === 200) {
            //     setUrlThumbnail(imageResponse.data)

            // } else {
            //     setErrThumbnail(imageResponse.errorMessage)
            // }
        }
    }

    return (
        <>
            <Modal title="Sửa bài viết" open={openUpdate} onCancel={() => setOpenUpdate(false)} width={1000} className='not-css'>
                <Form>
                    <div>
                        <h4>Tiêu đề bài viết:</h4>
                        <Form.Item

                        >
                            <Input placeholder="Tiêu đề" value={selectRecord?.title} />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item>
                            <MDEditor
                                value={inputMarkdown}
                                onChange={(event) => handleOnChange(event)}
                                preview="edit"
                                commandsFilter={(cmd) => (cmd.name && ["preview", "live"].includes(cmd.name)) ? false : cmd}
                                style={{
                                    background: '#e9ecef',
                                    color: 'black'
                                }}
                            />
                        </Form.Item>
                    </div>
                    <div>
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
                                    <div className="h-[120px] w-[200px]">
                                        <Image
                                            className="h-full w-full object-contain"
                                            width="100%"
                                            height="100%"
                                            preview={{
                                                visible: isPreviewVisible,
                                                mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                                onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                            }}
                                            src={`${storageUrl}/blog/${selectRecord?.thumbnail}`}
                                            alt="Preview"
                                        />
                                    </div>

                                    <SyncOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />

                                    <input
                                        type="file"
                                        id="chooseFile"
                                        onChange={handleUploadFile}
                                        className="!hidden"
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
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default BlogUpdate;