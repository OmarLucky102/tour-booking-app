/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateData = async (name, email) => {
  try {
    //waiting for the promis form axios req
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
