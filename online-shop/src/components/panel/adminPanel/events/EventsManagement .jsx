import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Image, message, Modal, Form, Input, DatePicker, Select, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import './EventsManagement.css';

const { Option } = Select;

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [form] = Form.useForm();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/event/events');
      setEvents(response.data);
    } catch (error) {
      message.error('مشکلی در دریافت داده‌ها به وجود آمده است.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/event/events/${id}`);
      message.success('رویداد با موفقیت حذف شد');
      setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
    } catch (error) {
      message.error('مشکلی در حذف رویداد به وجود آمده است.');
      console.error(error);
    }
  };

  const handleAddEvent = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('date', values.date);
    formData.append('status', values.status);
    if (values.image?.file) {
      formData.append('image', values.image.file); // آپلود فایل
    }

    try {
      if (isEditMode && currentEvent) {
        // Edit existing event
        const response = await axios.put(`http://127.0.0.1:5000/event/events/${currentEvent._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEvents(prevEvents => prevEvents.map(event => (event._id === currentEvent._id ? response.data : event)));
        message.success('رویداد با موفقیت ویرایش شد');
      } else {
        // Add new event
        const response = await axios.post('http://127.0.0.1:5000/event/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEvents(prevEvents => [...prevEvents, response.data]);
        message.success('رویداد با موفقیت اضافه شد');
      }

      form.resetFields();
      setIsModalVisible(false);
      setIsEditMode(false);
      setCurrentEvent(null);
    } catch (error) {
      message.error('مشکلی در عملیات به وجود آمده است.');
      console.error(error);
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditMode(true);
    setIsModalVisible(true);

    form.setFieldsValue({
      title: event.title,
      date: moment(event.date), // Convert date to moment object for the DatePicker
      status: event.status,
      image: null, // Reset image field; image won't be pre-filled
    });
  };

  const columns = [
    {
      title: 'تصویر',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={`http://127.0.0.1:5000/public/uploads/events/${image}`} alt="رویداد" width={80} />,
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
      ),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
            ویرایش
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            type="link" 
            danger 
            onClick={() => handleDelete(record._id)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>مدیریت رویدادها</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setIsEditMode(false);
            setIsModalVisible(true);
            form.resetFields();
          }}
        >
          افزودن رویداد
        </Button>
      </div>
      <Table 
        dataSource={events} 
        columns={columns} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={isEditMode ? "ویرایش رویداد" : "افزودن رویداد جدید"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          setCurrentEvent(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEvent}
        >
          <Form.Item
            name="title"
            label="عنوان رویداد"
            rules={[{ required: true, message: 'لطفاً عنوان رویداد را وارد کنید' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="تاریخ برگزاری"
            rules={[{ required: true, message: 'لطفاً تاریخ برگزاری را وارد کنید' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="image"
            label="تصویر"
            rules={isEditMode ? [] : [{ required: true, message: 'لطفاً تصویر را آپلود کنید' }]} // Optional in edit mode
          >
            <Upload
              beforeUpload={() => false} // Prevent direct upload
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>آپلود تصویر</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="وضعیت"
            rules={[{ required: true, message: 'لطفاً وضعیت رویداد را انتخاب کنید' }]}
          >
            <Select>
              <Option value="active">فعال</Option>
              <Option value="inactive">غیرفعال</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "ذخیره تغییرات" : "افزودن"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventsManagement;
