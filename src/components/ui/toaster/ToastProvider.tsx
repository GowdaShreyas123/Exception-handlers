import { toast } from 'sonner';

/**
 * Creates and displays a customized toast notification.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} [type='success'] - The type of toast to display ('success', 'error', 'info', 'warning', 'custom', 'promise').
 * @param {number} [duration=2000] - The duration of the toast in milliseconds.
 * @param {object} [info] - Additional information for custom toasts.
 * @returns {void}
 */

export const getSimpleToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' | 'custom' | 'promise' = 'success',
  duration: number = 2000,
  info?: { description?: string }
): void => {
  const defaultConfig: {
    duration: number;
    // style: {
    //   background: string;
    //   padding: string;
    //   color: string;
    // }; 
  } = {
    duration: duration,
    //  style: {  // if you want to customize the background color
    //   background: '#183D3D',
    //   padding: '16px',
    //   color: '#FAF1E4',
    // } 
  };

  const showSuccessToast = (): void => {
    toast.success(message || 'File processed successfully!', defaultConfig);
  };

  const showErrorToast = (): void => {
    toast.error(message || 'Failed to process the file. Please try again.', defaultConfig);
  };

  const showInfoToast = (): void => {
    toast.info(message || 'Processing your file...', defaultConfig);
  };

  const showWarningToast = (): void => {
    toast.warning(message || 'File format not recognized.', defaultConfig);
  };

  const showCustomToast = (): void => {
    toast(message || 'Custom notification', {
      ...defaultConfig,
      description: info?.description || 'This is a custom toast with description',
      action: {
        label: 'Undo',
        onClick: () => console.warn('Undo clicked'),
      },
    });
  };

  const showPromiseToast = (): void => {
    const promise: Promise<string> = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve(message || 'File uploaded successfully!');
        } else {
          reject(message || 'Upload failed!');
        }
      }, duration);
    });

    toast.promise(promise, {
      loading: message || 'Uploading file...',
      success: (data: string) => `${data}`,
      error: (error: string) => `${error}`,
    });
  };

  switch (type) {
    case 'success':
      showSuccessToast();
      break;
    case 'error':
      showErrorToast();
      break;
    case 'info':
      showInfoToast();
      break;
    case 'warning':
      showWarningToast();
      break;
    case 'custom':
      showCustomToast();
      break;
    case 'promise':
      showPromiseToast();
      break;
    default:
      showCustomToast();
  }
};
 