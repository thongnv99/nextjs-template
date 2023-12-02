'use client'
import React from 'react';
import './style.scss';
import TextInput from 'elements/TextInput';
import Lock from 'assets/svg/lock.svg';
import Calendar from 'assets/svg/calendar.svg';


const ListElements = () => {
  return (
    <div className='w-full h-full overflow-y-auto p-[2.4rem] list-elements'>
      <table className='w-full border-collapse max-w-screen-xl border border-primary-500 border-dashed table-auto'>
        <tbody>
          <tr>
            <td>Text input</td>
            <td>
              <TextInput leadingIcon={<Lock />} errorMessage="Họ và tên không dược để trống" label='Họ và tên' placeholder='Họ và tên của bạn...' type='password' />
            </td>
          </tr>
          <tr>
            <td>Date Picker</td>
            <td>
              <TextInput leadingIcon={<Calendar />} errorMessage="Họ và tên không dược để trống" label='Họ và tên' placeholder='Họ và tên của bạn...' type='date' />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ListElements