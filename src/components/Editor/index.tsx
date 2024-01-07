'use client';
import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import { ImageUploadAdapter } from './plugin';
import { useSession } from 'next-auth/react';
import './style.scss';
interface EditorProps {
  innerRef?: (instance: CustomEditor) => void;
  data?: string;
  onChange?: (data?: string) => void;
  id?: string;
  placeholder?: string;
  inline?: boolean;
}

const Editor = (props: EditorProps) => {
  const editorRef = React.useRef<CustomEditor>();
  const { data } = useSession();

  return (
    <div className={`h-full editor`}>
      <CKEditor
        editor={CustomEditor}
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
        config={{
          // toolbar: ['bold', 'italic'],
          removePlugins: ['Title'],
          placeholder: props.placeholder,
          mention: {
            feeds: [
              {
                marker: '[',
                feed: [
                  '[(1)]',
                  '[(2)]',
                  '[(3)]',
                  '[(4)]',
                  '[(5)]',
                  '[(6)]',
                  '[(7)]',
                  '[(8)]',
                  '[(9)]',
                  '[(10)]',
                  '[(11)]',
                ],
                minimumCharacters: 1,
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default Editor;
