import { toast } from 'react-toastify';

const myToastId = 'myToastId'
export const normalToast = (message: string) => {
  toast(message);
}

export const successToast = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const errorToast = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const warnToast = (message: string) => {
  toast.warn(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}

export const infoToast = (message: string) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: myToastId,
    autoClose: 3000
  });
}


// toast("Custom Style Notification with css class!", {
//   position: toast.POSITION.BOTTOM_RIGHT,
//   className: 'foo-bar'
// });