import { Card, Col, Row } from 'antd'
import React from 'react'

const TotalRevenueCard = () => {
    return (
        <div className="border bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8">
            <h2 className="text-lg font-semibold pb-5">Tổng Doanh Số</h2>
            <Row gutter={10}>
                <Col span={4}>
                    <div className='w-[150px] h-[150px] bg-[#d7e8ee] rounded-lg'>

                    </div>
                </Col>
                <Col span={4}>
                    <div className='w-[150px] h-[150px] bg-[#d7e8ee] rounded-lg'>

                    </div>
                </Col>
                <Col span={4}>
                    <div className='w-[150px] h-[150px] bg-[#d7e8ee] rounded-lg'>

                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default TotalRevenueCard