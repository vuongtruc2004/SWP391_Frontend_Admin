import React from 'react'
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DisplayBlog = ({ content }: { content: string }) => {
    return (
        <div className="chat-message">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    table({ children }) {
                        return (
                            <div style={{
                                overflowX: 'auto',
                                marginBlock: '12px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#60a5fa #495057',
                            }}>
                                <style>
                                    {`
                                    div::-webkit-scrollbar {
                                        display: block;
                                        height: 3px;
                                    }
                                    div::-webkit-scrollbar-track {
                                        background: #495057;
                                    }
                                    div::-webkit-scrollbar-thumb {
                                        background: #60a5fa;
                                    }
                                    div::-webkit-scrollbar-thumb:hover {
                                        background: #1976D2;
                                    }
                                `}
                                </style>
                                <table className="border-collapse w-full text-left">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children }) {
                        return (
                            <th className="bg-[#383738] text-white px-3 py-2 border border-[#595959]">
                                {children}
                            </th>
                        );
                    },
                    td({ children }) {
                        return (
                            <td className="px-3 py-2 border border-[#595959]">
                                {children}
                            </td>
                        );
                    },
                    ol({ children }) {
                        return (
                            <ol className='list-decimal list-outside my-3 px-5'>
                                {children}
                            </ol>
                        )
                    },
                    ul({ children }) {
                        return (
                            <ul className='list-disc my-3 px-5'>
                                {children}
                            </ul>
                        )
                    },
                    code({ children, className, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeText = String(children).replace(/\n$/, '');
                        const isTableFormat = codeText.includes('|') && codeText.split('\n').length > 1;

                        if (isTableFormat) {
                            return (
                                <div style={{
                                    overflowX: 'auto',
                                    marginBlock: '12px',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#60a5fa #495057',
                                }}>
                                    <style>
                                        {`
                                        .custom-scrollbar::-webkit-scrollbar {
                                            display: block;
                                            height: 3px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-track {
                                            background: #495057;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb {
                                            background: #60a5fa;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                            background: #1976D2;
                                        }
                                    `}
                                    </style>
                                    <code>
                                        {children}
                                    </code>
                                </div>
                            );
                        }

                        return match ? (
                            <div style={{
                                overflowX: 'auto',
                                borderRadius: '6px',
                                marginBlock: '12px',
                            }} className="custom-scrollbar">
                                <style>
                                    {`
                                    .custom-scrollbar .code-block::-webkit-scrollbar {
                                        display: block;
                                        height: 5px;
                                        border-radius: 6px;
                                    }
                                    .custom-scrollbar .code-block::-webkit-scrollbar-track {
                                        background: #495057;
                                        border-radius: 6px;
                                    }
                                    .custom-scrollbar .code-block::-webkit-scrollbar-thumb {
                                        background: #60a5fa;
                                        border-radius: 6px;
                                    }
                                    .custom-scrollbar .code-block::-webkit-scrollbar-thumb:hover {
                                        background: #1976D2;
                                    }
                                `}
                                </style>

                                {/*@ts-ignore */}
                                <SyntaxHighlighter
                                    {...props}
                                    PreTag="div"
                                    language={match[1]}
                                    style={vscDarkPlus}
                                    className="!m-0 rounded-br-md rounded-bl-md code-block"
                                >
                                    {codeText}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code {...props} className={className}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </Markdown>
        </div>
    )
}

export default DisplayBlog
