import Loader from 'components/Loader';
import TextInput from 'elements/TextInput';
import { Formik,FormikProps } from 'formik';
import React, { useRef } from 'react';
import { useSWRConfig } from 'swr';
import { isBlank, uuid } from 'utils/common';
import Dropdown from 'elements/Dropdown';
import * as yup from 'yup';
type AddExamForm = {
    onClose(): void;
  };
  

interface AddExamFormValues {
    competitionName:string,
    password:string,
    dateStart:Date,
    note:string,
    exam:string
}
const AddExamForm =(props: AddExamForm)=>{
  const CategoriesExam=[
    {
        label:'Đề thi 2023',
        value:1
    },
    {
        label:'Đề thi 2024',
        value:2
    },
    {
        label:'Đề thi 2019',
        value:3
    },
    {
        label:'Đề thi 2018',
        value:4
    },
  ]

  const handleSubmit = (values: AddExamFormValues) => {
    console.log("Kiềm tra xem có ra cái gì không nào",values)
  };
  const schema = yup.object().shape({
    competitionName: yup.string().label('Tên cuộc thi').required(),
  });

  return (
    <Loader  className="w-screen max-w-screen-md p-6">
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
            competitionName: '', 
            password: '',      
            dateStart: new Date(), 
            note: '', 
            exam:''
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          touched,
          errors,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Tên cuộc thi"
              name="competitionName"
              placeholder="Nhập tên cuộc thi ..."
              className="mb-4"
              onChange={handleChange}
              value={values?.competitionName}
              onBlur={handleBlur}
              hasError={touched.competitionName && !isBlank(errors.competitionName)}
              errorMessage={errors.competitionName}
            />
            
            <TextInput
              label="Ngày bắt đầu"
              name="dateStart"
              placeholder="dd/MM/yy ..."
              type="date"
              className="mb-4"
              onChange={handleChange}
              value={values?.dateStart as unknown as string}
              onBlur={handleBlur}
            />
            <TextInput
              label="Mật khẩu (nếu có)"
              name="password"
              placeholder="***********"
              className="mb-4"
              type="password"
              onChange={handleChange}
              value={values?.password}
              onBlur={handleBlur}
              hasError={touched.password && !isBlank(errors.password)}
              errorMessage={errors.password}
            />
            <Dropdown
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
            />
           {/* Chọn đề thi <Đang thiếu > */}
            <TextInput
              label="Ghi chú"
              name="note"
              className="mb-3"
              type="textarea"
              placeholder="Nội dung câu hỏi..."
              value={values?.note}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.note && !isBlank(errors.note)}
              errorMessage={errors.note}
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
export default AddExamForm