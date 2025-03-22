'use client'
import { validContent, validTitle } from "@/helper/create.blog.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import MDEditor, { getCommands, ICommand } from "@uiw/react-md-editor";
import { Avatar, Checkbox, Form, Image, Input, Modal, notification, Tooltip } from "antd";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import TurndownService from 'turndown'

const turndownService = new TurndownService();
interface IProps {
    openUpdate: boolean,
    setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>
    selectRecord: BlogResponse | null
    setSelectRecord: React.Dispatch<React.SetStateAction<BlogDetailsResponse | null>>
}

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const BlogUpdate = (props: IProps) => {
    const { openUpdate, setOpenUpdate, selectRecord, setSelectRecord } = props;
    const CheckboxGroup = Checkbox.Group;
    const router = useRouter();
    const [value, setValue] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [errThumbnail, setErrThumbnail] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [content, setContent] = useState<ErrorResponse>(initState);
    // const [checkList, setCheckList] = useState<string[]>(selectRecord?.hashtags.map((tag) => tag.tagName) || []);
    const [checkList, setCheckList] = useState<{ error: boolean, value: string[] }>({ error: false, value: selectRecord ? selectRecord?.hashtags.map((tag) => tag.tagName) : [] });
    const [listTag, setListTag] = useState<string[]>();
    const [plainContent, setPlainContent] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const uploadImageCommand: ICommand = {
        name: "upload-file",
        keyCommand: "upload-file",
        buttonProps: { "aria-label": "Upload File Image" },
        icon: <span>Upload File Image</span>, // Icon hiển thị
        execute: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpg, image/jpeg, image/png";
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement);
                if (file.files && file.files[0]) {
                    const formData = new FormData();
                    formData.set("file", file.files[0]);
                    formData.set("folder", "blog");

                    // Gửi request upload ảnh
                    const imageRes = await sendRequest<ApiResponse<string>>({
                        url: `${apiUrl}/blogs/up-thumbnail`,
                        method: "POST",
                        body: formData,
                    });

                    // Chèn Markdown vào editor
                    const imageMarkdown = `![image](${storageUrl}/blog/${imageRes.data})`;
                    setInputMarkdown((prev) => prev + `\n ${imageMarkdown} \n`);
                }
            };
            input.click();
        },
    };

    // Thêm command vào danh sách
    const customCommands = [...getCommands(), uploadImageCommand];


    useEffect(() => {
        const md = turndownService.turndown(`${selectRecord?.content}`);
        setInputMarkdown(md);
        setContent({
            ...content,
            value: inputMarkdown
        })
        setTitle({
            ...title,
            value: selectRecord?.title || ""
        });
    }, [selectRecord])

    useEffect(() => {
        if (selectRecord?.hashtags) {
            setCheckList((prev) => ({
                ...prev,
                value: selectRecord.hashtags.map((tag) => tag.tagName)
            }))
        }
        if (selectRecord) {
            setTitle({
                error: false,
                value: selectRecord.title
            });
            setContent({
                error: false,
                value: selectRecord.content
            });

            if (selectRecord?.thumbnail) {
                setUrlThumbnail(selectRecord?.thumbnail);
            }

        }
    }, [selectRecord, openUpdate]);

    useEffect(() => {

        const getAllSubjects = async () => {
            try {
                const getAllSub = await sendRequest<ApiResponse<SubjectResponse>>({
                    url: `${apiUrl}/hashtags/all`,
                    method: 'GET',
                });
                if (getAllSub.data && Array.isArray(getAllSub.data)) {
                    setListTag(getAllSub.data.map((hashTag: { tagName: string }) => hashTag.tagName));
                }
            } catch {
                console.error("Error fetching subjects");
            }
        };
        getAllSubjects()

    }, []);

    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const handleCancle = () => {
        setUrlThumbnail("");
        setThumbnail(null);
        setErrThumbnail("");
        setSelectRecord(null);
        setOpenUpdate(false);
        setCheckList((prev) => ({
            error: false,
            value: selectRecord ? selectRecord.hashtags.map((tag) => tag.tagName) : []
        }))
    }
    const handlOnChange = (list: string[]) => {
        setCheckList(prev => ({
            ...prev,
            value: list
        }));
    }

    const handleOnOk = async () => {
        const isValidTitle = validTitle(title, setTitle);
        const isValidContent = validContent(content, setContent);
        console.log({ title, content })

        if (!isValidTitle || !isValidContent) {
            return;
        }

        if (checkList && checkList.value.length === 0) {
            setCheckList(prev => ({ ...prev, error: true }));
            return;
        }

        const htmlTextContent = marked(inputMarkdown);
        setPlainContent(stripHtml(htmlTextContent.toString()));
        // setPlainContent(content.value);
        const blogRequest: BlogRequest = {
            title: title.value,
            content: htmlTextContent.toString(),
            plainContent: stripHtml(htmlTextContent.toString()),
            thumbnail: urlThumbnail,
            hashtags: checkList.value,
        }


        // giải thích nguyên lí hoạt động của markdown biến hóa từ text có kí tự thành text html và lưu plainContent: 
        // đầu tiền nó sẽ lấy nội dung từ db (server) lên, và nội dung này đang ở dạng text html. sau đó nó dùng turndown
        // để biến các tag html thành các kí hiệu đại diện. sau đó hiển thị ra mdeditor. khi sửa ở cửa sổ mdeditor, nó
        // sẽ xét lại cái inputMarkdown. inputMarkdown sẽ được lấy ra và dùng hàm marked để biến hóa các kí tự trong đó thành
        // các thẻ html. sau đó gắn lại vào content như trê.
        // việc set plainContent ta dùng hàm stripHtml được định nghĩa ở trên để loại bỏ các thẻ html rồi sau đó đưa nó vào plain content

        const updateBlog = await sendRequest<ApiResponse<BlogResponse>>({
            url: `${apiUrl}/blogs/update/${selectRecord?.blogId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: blogRequest,
        })


        if (updateBlog.status === 200) {
            handleCancle();
            router.refresh();
            notification.success({
                message: "Thành Công!",
                description: "Cập nhật bài viết thành công!",
            })
        } else {
            notification.error({
                message: "Thất Bại!",
                description: "Cập nhật bài viết thất bại!",
            })
        }

    }



    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")

        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'blog');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/blogs/up-thumbnail`,
                method: 'POST',
                headers: {},
                body: formData
            });
            if (imageResponse.status === 200) {
                setUrlThumbnail(imageResponse.data)

            } else {
                setErrThumbnail("Không thể tải hình ảnh lên!")
            }
            e.target.value = "";
        }
    }

    return (
        <>
            <Modal title="Sửa bài viết" open={openUpdate} onCancel={() => {
                setTitle({
                    ...title,
                    value: selectRecord?.title ? selectRecord.title : ""
                });
                setInputMarkdown(turndownService.turndown(`${selectRecord?.content}`))
                setUrlThumbnail(selectRecord?.thumbnail ? selectRecord.thumbnail : "");
                setOpenUpdate(false)
            }}
                width={1000} className='not-css'
                okText="Lưu"
                cancelText="Hủy"
                onOk={handleOnOk}
                maskClosable={false}
            >
                <Form>
                    <div>
                        <h4><span className="text-red-600">*</span>Tiêu đề bài viết:</h4>
                        <Form.Item

                        >
                            <Input placeholder="Tiêu đề" value={title.value}
                                status={title.error && title.value === "" ? "error" : ""}
                                type="text"
                                onChange={(e) => {
                                    setTitle({
                                        ...title,
                                        value: e.target.value
                                    })
                                }}
                            />
                            {title.error && title.value === "" && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    {title.message}
                                </p>
                            )}
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item>
                            {/* Chọn một file trong máy tính rồi gắn vào */}
                            {/* <MDEditor
                                value={inputMarkdown}
                                onChange={(event) => {
                                    setInputMarkdown(event ? event : "")

                                    // setPlainContent(event ? event : "")
                                    console.log(event)
                                }}
                                preview="edit"
                                commandsFilter={(cmd) => {
                                    if (cmd.name && ["preview", "live"].includes(cmd.name)) {
                                        return false;
                                    }

                                    if (cmd.name === "image") {

                                        cmd.execute = () => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/jpg, image/jpeg, image/png";
                                            input.onchange = async (event) => {
                                                const file = (event.target as HTMLInputElement);
                                                if (file.files && file.files[0]) {
                                                    const formData = new FormData();
                                                    formData.set('file', file.files[0]);
                                                    formData.set('folder', 'blog');

                                                    const imageRes = await sendRequest<ApiResponse<string>>({
                                                        url: `${apiUrl}/blogs/up-thumbnail`,
                                                        method: 'POST',
                                                        headers: {},
                                                        body: formData
                                                    });

                                                    const fileExtension = file.name.split('.').pop()?.toLowerCase();
                                                    const imageMarkdown = `![image](${storageUrl}/blog/${imageRes.data})`
                                                    setInputMarkdown((prev) => prev + "\n </br>" + imageMarkdown + "</br>")
                                                    console.log(imageRes)


                                                }
                                            };

                                            input.click();

                                        }
                                    }

                                    return cmd;

                                }
                                    // cmd.name && ["preview", "live"].includes(cmd.name)) ? false : cmd


                                }

                                style={{
                                    background: '#e9ecef',
                                    color: 'black'
                                }}
                            /> */}

                            {/* Ở dưới: Copy url của ảnh trên mạng gắn vào */}
                            <h4><span className="text-red-600">*</span>Nội dung bài viết</h4>
                            <MDEditor
                                value={inputMarkdown}
                                onChange={(event) => {
                                    setInputMarkdown(event ? event : "")
                                    setContent({
                                        ...content,
                                        value: event ? event : ""
                                    })
                                }}
                                preview="edit"
                                commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
                                style={{
                                    background: '#e9ecef',
                                    color: 'black'
                                }}
                                commands={customCommands}
                            />


                            {content.error && inputMarkdown === "" && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    {content.message}
                                </p>
                            )}
                        </Form.Item>
                    </div>
                    <div className="mb-5">
                        <h4><span className="text-red-600">*</span> Lĩnh vực:</h4>
                        <CheckboxGroup
                            options={listTag?.map((tag) => ({
                                label: tag,
                                value: tag,
                            }))}
                            value={checkList.value}
                            onChange={handlOnChange}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                            }}
                        />
                        {checkList.error && checkList.value.length === 0 && (
                            <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                <WarningOutlined />
                                Vui lòng thêm chủ đề bài viết
                            </p>
                        )}
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
                                            src={`${storageUrl}/blog/${urlThumbnail}`}
                                            alt="Preview"
                                        />
                                    </div>

                                    <Tooltip placement="bottom" title={"Tải lên ảnh khác"}>
                                        <SyncOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />
                                    </Tooltip>

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