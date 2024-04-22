import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface ModalProviderProps {
  show?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  dialogClass?: string;
}

const ModalProvider = (props: ModalProviderProps) => {
  const handleClose = () => {
    props.onClose?.();
  };
  return (
    <Transition appear show={props.show || false} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="modal fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-fit transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all ${
                  props.dialogClass ?? ''
                }`}
              >
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalProvider;
