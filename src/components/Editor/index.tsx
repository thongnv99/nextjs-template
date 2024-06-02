'use client';
import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import { ImageUploadAdapter } from './plugin';
import { useSession } from 'next-auth/react';
import './style.scss';
import { useTranslation } from 'app/i18n/client';
interface EditorProps {
  innerRef?: (instance: CustomEditor) => void;
  data?: string;
  onChange?: (data: string) => void;
  id?: string;
  placeholder?: string;
  inline?: boolean;
}

const Editor = (props: EditorProps) => {
  const editorRef = React.useRef<CustomEditor>();
  const { data } = useSession();
  const { t } = useTranslation();

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
          props.onChange?.(data ?? '');
        }}
        config={{
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'code',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              '|',
              'fontBackgroundColor',
              'fontColor',
              'fontFamily',
              'fontSize',
              '|',
              'highlight',
              'horizontalLine',
              'imageInsert',
              '|',
              'undo',
              'redo',
            ],
          },
          removePlugins: ['Title'],
          placeholder: (t(props.placeholder as string) as string) ?? '',
        }}
      />
    </div>
  );
};

export default Editor;
