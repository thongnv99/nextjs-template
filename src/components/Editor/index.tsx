'use client';
import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ImageUploadAdapter } from './plugin';
import { useSession } from 'next-auth/react';
import './style.scss';
interface EditorProps {
  innerRef?: (instance: ClassicEditor) => void;
  data?: string;
  onChange?: (data?: string) => void;
  id?: string;
}

const Editor = (props: EditorProps) => {
  const editorRef = React.useRef<ClassicEditor>();
  const { data } = useSession();

  return (
    <div className="h-full editor">
      <CKEditor
        editor={ClassicEditor}
        data={props.data}
        onReady={editor => {
          editorRef.current = editor;
          props.innerRef?.(editor);
          editor.plugins.get('FileRepository').createUploadAdapter = loader => {
            return new ImageUploadAdapter(loader, data?.token);
          };
        }}
        onChange={event => {
          const data = editorRef.current?.getData();
          props.onChange?.(data);
        }}
      />
    </div>
  );
};

export default Editor;
