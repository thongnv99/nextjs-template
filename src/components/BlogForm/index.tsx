'use client';
import BlogDetail from 'components/BlogDetail';
import { useUpdateBlogMutation } from 'components/BlogManagement/mutation';
import ConfirmModal from 'components/ConfirmModal';
import Loader from 'components/Loader';
import ModalProvider from 'components/ModalProvider';
import TextInput from 'elements/TextInput';
import { Formik, FormikProps } from 'formik';
import { METHOD } from 'global';
import { useMutation } from 'hooks/swr';
import { IBlog } from 'interfaces';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { isBlank, uuid } from 'utils/common';
const Editor = dynamic(() => import('components/Editor'), { ssr: false });

interface BlogForm {
  title: string;
  content: string;
  description?: string;
}

const BlogForm = () => {
  const formRef = useRef<FormikProps<BlogForm>>();
  const componentId = useRef(uuid());
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [blogId, setBlogId] = useState(id);

  const [successModal, setSuccessModal] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    show: boolean;
    data?: IBlog;
  }>({ show: false });

  const { trigger: getBlogDetail } = useMutation<IBlog>('BLOG_GET_DETAIL', {
    url: '/api/v1/posts/{postId}',
    method: METHOD.GET,
    loading: true,
    componentId: componentId.current,
    onSuccess(data) {
      if (data) {
        formRef.current?.setValues(data);
      }
    },
  });
  const { trigger } = useMutation('BLOG_CREATE_BLOG', {
    url: '/api/v1/posts',
    method: METHOD.POST,
    loading: true,
    componentId: componentId.current,
    notification: {
      title: 'Lưu bài viết',
      content: 'Lưu bài viết thành công',
    },
    onSuccess(data) {
      console.log({ data });
      // setBlogId(data.res)
    },
  });

  const { trigger: updateBlog } = useUpdateBlogMutation({
    componentId: componentId.current,
    onSuccess() {
      console.log('success');
    },
    notification: {
      title: 'Cập nhật bài viết',
      content: 'Cập nhật bài viết thành công',
    },
  });

  useEffect(() => {
    if (!isBlank(id)) {
      setTimeout(() => {
        getBlogDetail({ postId: id });
      });
    }
  }, []);

  const handleSubmit = (values: BlogForm) => {
    if (blogId) {
      updateBlog({
        postId: blogId,
        title: values.title,
        content: values.content,
        description: values.description,
      });
    } else {
      trigger(values as unknown as Record<string, unknown>);
    }
  };

  const handleShowSuccess = () => {
    setSuccessModal(true);
  };

  const handleHiddenSuccess = () => {
    setSuccessModal(false);
    // router.push(`/${lng}/${ROUTES.LOGIN}`);
  };

  const handleSave = () => {
    formRef?.current?.submitForm();
  };

  const handlePreview = () => {
    setPreviewModal({
      show: true,
      data: {
        content: formRef.current?.values.content ?? '',
        title: formRef.current?.values.title ?? '',
        createdAt: new Date().getTime(),
        status: 'DRAFT',
        id: componentId.current,
      },
    });
  };

  return (
    <Loader
      id={componentId.current}
      className="p-6 w-full bg-white m-auto max-w-screen-lg flex flex-col h-full overflow-y-auto"
    >
      <div className="flex justify-between items-center sticky ">
        <div className="text-lg font-semibold">
          {isBlank(blogId) ? 'Tạo blog' : 'Cập nhật blog'}
        </div>
        <div className="flex">
          <button className="btn mr-6" type="button" onClick={handlePreview}>
            Xem trước
          </button>
          <button className="btn-primary" type="button" onClick={handleSave}>
            Lưu blog
          </button>
        </div>
      </div>
      <div className="w-full flex-1 mt-6">
        <Formik
          onSubmit={handleSubmit}
          innerRef={instance => (formRef.current = instance!)}
          initialValues={
            {
              title: '',
              content: '',
              description: '',
            } as BlogForm
          }
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            touched,
            errors,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col gap-6"
            >
              <TextInput
                label="Tiêu đề"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.title && !isBlank(errors.title)}
                errorMessage={errors.title}
                value={values.title}
                // leadingIcon={<Mail />}
                placeholder="Tiêu đề của blog"
              />
              <TextInput
                label="Mô tả"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.description && !isBlank(errors.description)}
                errorMessage={errors.description}
                value={values.description}
                // leadingIcon={<Mail />}
                placeholder="Mô tả"
              />
              <div className="flex-1 flex flex-col">
                <div>Nội dung</div>
                <div className="flex-1">
                  <Editor
                    data={values.content}
                    onChange={data => setFieldValue('content', data)}
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>

        <ModalProvider show={successModal} onClose={handleHiddenSuccess}>
          <ConfirmModal
            onCancel={handleHiddenSuccess}
            // onConfirm={handleHiddenSuccess}
            title="Tạo bài viêt"
            content="Bài viết của bạn đã được lưu vào hệ thống. "
            type="success"
            labelConfirm="Đăng"
          />
        </ModalProvider>
        <ModalProvider
          show={previewModal.show}
          onClose={() => setPreviewModal({ show: false })}
        >
          {previewModal.data && (
            <div className="w-screen  p-6 m-auto max-w-screen-md flex flex-col">
              <div className="max-h-[80vh] w-full  overflow-y-auto mb-6">
                <BlogDetail data={previewModal.data} />
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPreviewModal({ show: false })}
              >
                Đóng
              </button>
            </div>
          )}
        </ModalProvider>
      </div>
    </Loader>
  );
};

export default BlogForm;
