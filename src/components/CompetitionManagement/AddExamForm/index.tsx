import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik, FormikProps } from 'formik';
import React, { useRef } from 'react';
import { isBlank, uuid } from 'utils/common';
import Dropdown from 'elements/Dropdown';
import { useMutation } from 'hooks/swr';
import { METHOD } from 'global';
import { useSWRConfig } from 'swr';
import { IContest, IResponseDefault } from 'interfaces';

import * as yup from 'yup';
type AddExamForm = {
  data?: IContest; // for edit
  onClose(): void;
  onRefresh(): void;
};

interface AddExamFormValues {
  title: string;
  description: string;
}
const AddExamForm = (props: AddExamForm) => {
  const componentId = useRef(uuid());
  const CategoriesExam = [
    {
      label: 'Đề thi 2023',
      value: 1,
    },
    {
      label: 'Đề thi 2024',
      value: 2,
    },
    {
      label: 'Đề thi 2019',
      value: 3,
    },
    {
      label: 'Đề thi 2018',
      value: 4,
    },
  ];
  const { trigger: createCompetition } = useMutation(
    'COMPETITION_CREATE_COMPETITION',
    {
      url: '/api/v1/contests',
      method: METHOD.POST,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Tạo cuộc thi',
        content: 'Tạo cuộc thi thành công.',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const { trigger: updateCompetition } = useMutation(
    'COMPETITION_UPDATE_COMPETITION',
    {
      url: '/api/v1/contests/{contestId}',
      method: METHOD.PUT,
      componentId: componentId.current,
      loading: true,
      notification: {
        title: 'Cập nhật cuộc thi ',
        content: 'Cập nhật cuộc thi thành công.',
      },
      onSuccess() {
        props.onClose();
        props.onRefresh();
      },
    },
  );
  const handleSubmit = (values: AddExamFormValues) => {
    if (props.data) {
      updateCompetition({
        contestId: props.data?.id,
        title: values.title,
        description: values.description,
      });
    } else {
      createCompetition({
        title: values.title,
        description: values.description,
      });
    }
  };
  const schema = yup.object().shape({
    title: yup.string().label('Tên cuộc thi').required(),
  });

  return (
    <Loader id={componentId.current} className="w-screen max-w-screen-md p-6">
      <div className="flex flex-col mb-5">
        <div className="text-lg font-bold text-gray-900">Tạo cuộc thi</div>
        <div className="text-sm font-normal text-gray-500">
          Nhập nội dung câu hỏi và đáp án
        </div>
      </div>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          title: props.data?.title ?? '',
          description: props.data?.description ?? '',
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          touched,
          errors,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Tên cuộc thi"
              name="title"
              placeholder="Nhập tên cuộc thi ..."
              className="mb-4"
              onChange={handleChange}
              value={values?.title}
              onBlur={handleBlur}
              hasError={touched.title && !isBlank(errors.title)}
              errorMessage={errors.title}
            />
            {/* <div className="flex gap-x-4">
              <TextInput
                label="Ngày bắt đầu"
                name="dateStart"
                placeholder="dd/mm/yy ..."
                type="date"
                className="mb-4 w-1/2"
                onChange={handleChange}
                value={values?.dateStart as unknown as string}
                onBlur={handleBlur}
              />
              <TextInput
                label="Ngày kết thúc"
                name="dateFinish"
                placeholder="dd/mm/yy ..."
                type="date"
                className="mb-4 w-1/2"
                onChange={handleChange}
                value={values?.dateFinish as unknown as string}
                onBlur={handleBlur}
              />
            </div> */}

            {/* <Dropdown
                options={CategoriesExam?.map((item:any)=>{
                    return {
                        label:item.label,
                        value:item.value
                    }
                })}
                label="Đề thi"
                className="mb-3"
                placeholder="Chọn đề thi" 
                initial
                selected={values?.exam}
                onChange={value =>
                    setFieldValue('exam', value)
                }
            /> */}
            {/* Chọn đề thi <Đang thiếu > */}
            <TextInput
              label="Mô tả"
              name="description"
              className="mb-3"
              type="textarea"
              placeholder="Mô tả cuộc thi...."
              value={values?.description}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.description && !isBlank(errors.description)}
              errorMessage={errors.description}
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="btn flex-1"
                onClick={props.onClose}
              >
                Đóng
              </button>
              <button type="submit" className="btn-primary flex-1">
                Xác nhận
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Loader>
  );
};
export default AddExamForm;
