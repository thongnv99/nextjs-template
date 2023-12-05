export interface NotificationConfig {
  title?: string;
  ignoreSuccess?: boolean;
  ignoreError?: boolean;
  type?: 'TOAST' | 'MODAL';
  content?: string;
}
