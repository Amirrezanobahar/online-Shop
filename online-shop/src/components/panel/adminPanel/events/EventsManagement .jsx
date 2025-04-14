import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Image, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './EventsManagement .css'

const EventsManagement = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // TODO: در آینده به API متصل کن
    setEvents([
      { id: 1, title: 'تخفیف ویژه بهار', date: '2025-04-20', image: 'https://via.placeholder.com/100', status: 'active' },
      { id: 2, title: 'حراج تابستانه', date: '2025-06-15', image: 'https://via.placeholder.com/100', status: 'inactive' }
    ]);
  }, []);

  const handleDelete = (id) => {
    message.success('رویداد با موفقیت حذف شد');
    setEvents(events.filter(event => event.id !== id));
  };

  const columns = [
    {
      title: 'تصویر',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} alt="رویداد" width={80} />
    },
    {
      title: 'عنوان رویداد',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'تاریخ برگزاری',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'فعال' : 'غیرفعال'}
        </Tag>
      )
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button icon={<EditOutlined />} type="link">
            ویرایش
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            حذف
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>مدیریت رویدادها</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          افزودن رویداد
        </Button>
      </div>
      <Table 
        dataSource={events} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default EventsManagement;
